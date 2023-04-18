# 综合医疗服务平台
华北水利水电大学信息工程学院


作品概述

我们的作品基于许多医疗人员对于疾病以及人体健康方面的研究与总结，对已经获得大
量医疗实体与实体间的关系数据进行处理。构建一个庞大的 neo4j 数据库，并进行知识医疗
图谱的搭建。最终依托网页，构建了一个综合的医疗服务平台。实现了人们发现自身或亲人
的身体不适，及时通过浏览器访问我们的网页进行医疗方面的咨询。同时还能查询某种疾病，
获取其症状及其已知的治疗方式。

部署教程：

一、项目环境搭建

1.	首先安装jdk，https://www.oracle.com/java/technologies/downloads/，并且部署好path

2.下载neo4j，我们使用社区版https://neo4j.com/download-center/#community，这个不需要安装。部署好path路径后，可以cmd中使用neo4j.bat console指令启动，后在浏览器中访问http://localhost:7474/browser/，就可以打开数据库，并设置连接（初始名字和密码都是neo4j）
 
 

3.配置mongodb数据库，在这个地址下载
https://www.mongodb.com/try/download/community，并配置它的path路径。在你data的目录下，创建一个db文件， 类似于：‘D:\Mongodb\Server\data\db’;
在cmd中找到创建的db文件
 

并使用这个命令来启动mongod   --dbpath D:\Mongodb\Server\data\db，同时可以得到你的端口号
 
通过浏览器访问http://localhost:端口号，就启动了db数据库
如果觉得还是不太明白请自行学习
https://blog.csdn.net/liu991029/article/details/114709588

二、数据获取

1. 运行data_spider.py（保证mongodb服务是开启的）

2．运行build_data.py

三、搭建图数据库

1.首先运行build_medicalgraph.py,这其中部分改成自己的neo4j的user，name，password 
 
运行代码等待其完成关系数据库的建立，由于数据量比较大，所以可能会产生较长的时间消耗。

四、智能问答

1.	运行question_classifier.py

2.	运行chatbot_graph.py

3.	运行api.py

五、网页版运行

1.	在项目的web文件夹中，点击web.html在浏览器中体验项目




⚠️注意：遇到python文件运行问题可能是第三方库pip问题，请自行解决。


