FROM node:16
RUN apt-get update
RUN mkdir /home/ubuntu && mkdir /home/ubuntu/project
WORKDIR /home/ubuntu/project
RUN git clone https://github.com/het-patel99/Recipe_Recommender.git
WORKDIR /home/ubuntu/project/Recipe_Recommender/Code/frontend
RUN sed -i 's/##serverIp##/localhost:1000/g' src/apis/recipeDB.js
RUN npm install -g n
RUN npm install
CMD ["npm", "start"]