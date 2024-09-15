FROM node:14

# Install wget and bzip2
RUN apt-get update && apt-get install -y wget bzip2

# Install Miniconda
RUN wget https://repo.anaconda.com/miniconda/Miniconda3-latest-Linux-x86_64.sh -O miniconda.sh
RUN bash miniconda.sh -b -p /opt/conda
ENV PATH="/opt/conda/bin:${PATH}"

# Set up the working directory
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