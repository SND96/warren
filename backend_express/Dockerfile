FROM continuumio/miniconda3

# Set up the Node.js environment
RUN conda install -c conda-forge nodejs=14

WORKDIR /app

# Copy and install Node.js dependencies
COPY package*.json ./
RUN npm install

# Copy and create Conda environment
COPY environment.yml ./
RUN conda env create -f environment.yml

# Activate Conda environment
SHELL ["conda", "run", "-n", "warren-env", "/bin/bash", "-c"]

COPY . .

# Set the default command to run when starting the container
CMD ["conda", "run", "--no-capture-output", "-n", "warren-env", "npm", "start"]