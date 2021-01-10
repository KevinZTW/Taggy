# Taggy
A RSS reader and web clipper helping users to explore and manage software articles on the internet

[Home Page](https://www.twtaggy.site)   
[Chrome Extension ](http://extension.twtaggy.site)


## Test User

Email: user@gmail.com

Password: 123123 

(For extension usage, please refresh webpage after installing the extension)


## Technologies :

### Back-End
- Framework : Node.js / Express.js
- Data Transport : RESTful API
- Proxy Server : NGINX
- SSL Certificate : AWS Certificate Manager, ZeroSSL

### Front-End 
- Framework : React / React-Router 
- State Managment : Redux
- Others : Chrome Extension Development
- HTML / CSS Modules / JavaScript (ES6)


### Cloud Service (AWS)
-   Compute : EC2
-   Storage : S3
-   Database : RDS
-   Network : CloudFront, Certificate Manager

### Database
-   System : MySQL
-   Cache : Redis
-   Service : CloudFirestore

### Tools
-   Linter: ESLint

### Others 
- NLP : Jieba
- Data Visualization : D3.js
- Authentication : Firebase Authentication
- Design Pattern : MVC


## Architecture
![image](https://user-images.githubusercontent.com/38662781/104088757-fea05780-52a3-11eb-9cc2-ae7eedba8820.jpg)

## Database Schema (RDS)
<img width="946" alt="Screen Shot 2021-01-10 at 12 28 11 PM" src="https://user-images.githubusercontent.com/38662781/104114431-58a22b00-533f-11eb-960e-0a55eca7393e.png">


## Features
### RSS Function

#### Feed Categorized / Recommendation
On top of the feed page, the tech related keyword would be listed if any. Related Feeds with same keywords would be shown on the bottom 
![keywordRSS](https://user-images.githubusercontent.com/38662781/104113716-1ecd2680-5337-11eb-86f6-97857b809dcc.gif)


#### RSS Search
User could enter RSS source link, medium profile page link or youtube channel link, and get the search outcome with full content
![addRSS](https://user-images.githubusercontent.com/38662781/104092909-138be380-52c2-11eb-8f87-824c97ceeddd.gif)

#### RSS Subscription
User could subscribe RSS sources which recommended on the website or shown on the search outcome and get daily updated feeds 
![subscribeRSS](https://user-images.githubusercontent.com/38662781/104113804-35c04880-5338-11eb-83a3-7350b8d85f87.gif)

#### Feed Search
User could enter words they interested and get the search outcome with same keyword highlighted in the title / content
![searchFeed](https://user-images.githubusercontent.com/38662781/104113867-e890a680-5338-11eb-94b2-0d68d089fa62.gif)

### Board Function

#### Save to My Board
User could click to save RSS Feed and use chrome extension to save website clip into their board
![saveclip](https://user-images.githubusercontent.com/38662781/104114036-d31c7c00-533a-11eb-805d-1ea95574738b.gif)

#### Article highlight
User could add highlight on the article and open side panel to see all highlights 
![hightlightArticle](https://user-images.githubusercontent.com/38662781/104114327-5095bb80-533e-11eb-9bc0-7f21becbf63c.gif)


#### Article tag
User could add tag to the article saved in their board, the tag could be ordered in different folder by drag and drop
![taggedArticle](https://user-images.githubusercontent.com/38662781/104114292-b897d200-533d-11eb-915e-b6c95ed784ba.gif)


User could see all tags in *Tag Graph*, tag that show in same article would be added connection
![taggraph](https://user-images.githubusercontent.com/38662781/104114372-a23e4600-533e-11eb-9dc5-e61d0d95f92c.gif)






## Author
Software Development by Kevin Zhang

Email : [kevin.zhang.tw@gmail.com](mailto:kevin.zhang.tw@gmail.com)


UI / Interaction Deisgn by Kelly Huang

Email : [tw.kelly.huang@gmail.com](mailto:tw.kelly.huang@gmail.com)


