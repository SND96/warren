# %%
import sys
from anthropic import Anthropic
import wikipedia
from dotenv import load_dotenv
import sqlite3
from datetime import datetime


load_dotenv('.env')
client = Anthropic()

# %%

def get_article(search_term):
    results = wikipedia.search(search_term)
    first_result = results[0]
    page = wikipedia.page(first_result, auto_suggest=False)
    return page.content

article_search_tool = {
    "name": "get_article",
    "description": "A tool to retrieve an up to date Wikipedia article.",
    "input_schema": {
        "type": "object",
        "properties": {
            "search_term": {
                "type": "string",
                "description": "The search term to find a wikipedia article by title"
            },
        },
        "required": ["search_term"]
    }
}
def create_database():
    conn = sqlite3.connect('local_wiki_database.db')
    cursor = conn.cursor()
    
    # Create table if it doesn't exist
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS local_wiki_articles
        (id INTEGER PRIMARY KEY AUTOINCREMENT,
         title TEXT,
         article TEXT,
         timestamp DATETIME DEFAULT CURRENT_TIMESTAMP)
    ''')

def save_to_database(title, article, branch_topics):
    conn = sqlite3.connect('local_wiki_database.db')
    cursor = conn.cursor()
    # Insert the question and answer
    cursor.execute('INSERT INTO local_wiki_articles (title, article) VALUES (?, ?)', (title, article))
    
    conn.commit()
    conn.close()

def get_from_database(title,branch_topics):
    # print(f"Getting from database: {title}")
    conn = sqlite3.connect('local_wiki_database.db')
    cursor = conn.cursor()
    cursor.execute('SELECT article FROM local_wiki_articles WHERE title = ?', (title,))
    result = cursor.fetchone()
    conn.close()
    return result[0] if result else None


# %%
def answer_question_mult(question, branch_topics =  []):

    system_prompt = f"""
    You will be asked a question by the user. 
    If answering the question requires data you were not trained on, you can use the get_article tool to get the contents of a recent wikipedia article about the topic. 
    If you can answer the question without needing to get more information, please do so. 
    The current date is {datetime.now()}.
    Only call the tool when needed. 
    When you can answer the question, answer like you are a teacher and the user is a student but only a few sentences. Make sure to enclose the answer in <answer> tags."""
    prompt = f"""
    Answer the following question <question>{question}</question>
    When you can answer the question, answer like you are a teacher and the user is a student but only a few sentences. Make sure to enclose the answer in <answer> tags."""

    messages = [{"role": "user", "content": prompt}]

    
    response = client.messages.create(
        model="claude-3-sonnet-20240229",
        system=system_prompt, 
        messages=messages,
        max_tokens=1000,
        tools=[article_search_tool]
    )
    create_database()

    while(response.stop_reason == "tool_use"):
            tool_use = response.content[-1]
            tool_name = tool_use.name
            tool_input = tool_use.input
            messages.append({"role": "assistant", "content": response.content})
            if tool_name == "get_article":
                search_term = tool_input["search_term"]
                # print(f"Claude wants to get an article for {search_term}")
                wiki_result = get_from_database(search_term, branch_topics)
                if wiki_result is None:
                    # print("Not in database, getting from wikipedia")
                    branch_topics.append(search_term)
                    wiki_result = get_article(search_term) #get wikipedia article content
                    save_to_database(search_term,wiki_result, branch_topics)
                # print(f"wiki_result: {wiki_result}")
                #construct our tool_result message
                tool_response = {
                    "role": "user",
                    "content": [
                        {
                        "type": "tool_result",
                        "tool_use_id": tool_use.id,
                        "content": wiki_result
                        }
                        ]
                        }
                
                messages.append(tool_response)
                #respond back to Claude
                response = client.messages.create(
                    model="claude-3-sonnet-20240229",
                    system=system_prompt, 
                    messages=messages,
                    max_tokens=1000,
                    tools=[article_search_tool]
                )
       
    # print("Claude's final answer:")
    answer_start = response.content[0].text.find("<answer>") + len("<answer>")
    answer_end = response.content[0].text.find("</answer>")
    answer = response.content[0].text[answer_start:answer_end]
    return answer


# %%
def main():
    if len(sys.argv) < 2:
        print("Error: No question provided")
        sys.exit(1)

    question = sys.argv[1]
    answer = answer_question_mult(question)
    print(answer)

if __name__ == "__main__":
    load_dotenv('.env')
    main()
 # %%

