
/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;



DROP TABLE IF EXISTS `RSS`;
CREATE TABLE `RSS`
(
 `RSSId`         varchar(255) NOT NULL ,
 `RSSName`        varchar(255) NOT NULL ,
 `RSSDescription` varchar(255) NULL ,
 `RSSUrl`         varchar(255) NOT NULL ,
 `RSSLastUpdate`  bigint NULL ,
 `RSSImg`         varchar(255) NULL ,
FULLTEXT `fulltext_index` (`RSSName`, `RSSDescription`),
PRIMARY KEY (`RSSId`)
);

DROP TABLE IF EXISTS `User`;
CREATE TABLE `User`
(
 `UserUID`      varchar(255) NOT NULL ,
 `DisplayName` varchar(255) NULL ,
 `Email`       varchar(255) NOT NULL ,

PRIMARY KEY (`UserUID`)
);



DROP TABLE IF EXISTS `Feed`;
CREATE TABLE `Feed`
(
 `FeedId`             varchar(255)  NOT NULL ,
 `RSSId`              varchar(255) NOT NULL ,
 `FeedTitle`          varchar(255) NOT NULL ,
 `FeedContent`        varchar(65535) NOT NULL ,
 `FeedContentSnippet` varchar(65535) NOT NULL ,
 `FeedGuid`           varchar(255) NULL ,
 `FeedPubDate`        bigint NULL ,
 `FeedLink`           varchar(255) NULL ,

FULLTEXT `fulltext_index` (`FeedTitle`, `FeedContent`),
PRIMARY KEY (`FeedId`, `RSSId`),
KEY `fkIdx_28` (`RSSId`),
CONSTRAINT `FK_28` FOREIGN KEY `fkIdx_28` (`RSSId`) REFERENCES `RSS` (`RSSId`)
);

DROP TABLE IF EXISTS `UserSubscription`;
CREATE TABLE `UserSubscription`
(
 `SubscriptionId`  int auto_increment NOT NULL ,
 `UserUID`         varchar(255) NOT NULL ,
 `RSSId`          varchar(255) NOT NULL ,

PRIMARY KEY (`SubscriptionId`, `UserUID`, `RSSId`),
KEY `fkIdx_41` (`UserUID`),
CONSTRAINT `FK_41` FOREIGN KEY `fkIdx_41` (`UserUID`) REFERENCES `User` (`UserUID`),
KEY `fkIdx_48` (`RSSId`),
CONSTRAINT `FK_48` FOREIGN KEY `fkIdx_48` (`RSSId`) REFERENCES `RSS` (`RSSId`)
);

DROP TABLE IF EXISTS `KeyWord`;
CREATE TABLE `KeyWord`
(
 `KeyWordId`    int auto_increment NOT NULL ,
 `KeyWordName` varchar(45) NOT NULL ,

PRIMARY KEY (`KeyWordId`)
);

CREATE TABLE `Category`
(
 `CategoryId`  int auto_increment NOT NULL ,
 `CategoryName` varchar(45) NOT NULL ,

PRIMARY KEY (`CategoryId`)
);

DROP TABLE IF EXISTS `CategoryKeyWords`;
CREATE TABLE `CategoryKeyWords`
(
 `CategoryKeyWordsId` int auto_increment NOT NULL ,
 `CategoryId`         int  NOT NULL ,
 `KeyWordId`         int NOT NULL ,

PRIMARY KEY (`CategoryKeyWordsId`, `CategoryId`, `KeyWordId`),
KEY `fkIdx_75` (`CategoryId`),
CONSTRAINT `FK_74` FOREIGN KEY `fkIdx_75` (`CategoryId`) REFERENCES `Category` (`CategoryId`),
KEY `fkIdx_78` (`KeyWordId`),
CONSTRAINT `FK_77` FOREIGN KEY `fkIdx_78` (`KeyWordId`) REFERENCES `KeyWord` (`KeyWordId`)
);

DROP TABLE IF EXISTS `FeedKeyWords`;
CREATE TABLE `FeedKeyWords`
(
 `FeedKeyWordsId` int auto_increment NOT NULL ,
 `FeedId`         varchar(255) NOT NULL ,
 `KeyWordId`         int NOT NULL ,
 `Weight` float NOT NULL,

PRIMARY KEY (`FeedKeyWordsId`, `FeedId`, `KeyWordId`),
FOREIGN KEY (`FeedId`) REFERENCES `Feed` (`FeedId`),
FOREIGN KEY (`KeyWordId`) REFERENCES `KeyWord` (`KeyWordId`)
);


