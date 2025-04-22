-- MySQL dump 10.13  Distrib 8.0.41, for Win64 (x86_64)
--
-- Host: 31.170.162.152    Database: webinfinity_slock
-- ------------------------------------------------------
-- Server version	5.5.5-10.11.11-MariaDB-cll-lve

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `actions`
--

DROP TABLE IF EXISTS `actions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `actions` (
  `action_id` int(11) NOT NULL AUTO_INCREMENT,
  `action_name` varchar(255) NOT NULL,
  `category_id` int(11) NOT NULL,
  PRIMARY KEY (`action_id`),
  KEY `category_id` (`category_id`),
  CONSTRAINT `actions_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `category` (`category_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `actions`
--

LOCK TABLES `actions` WRITE;
/*!40000 ALTER TABLE `actions` DISABLE KEYS */;
INSERT INTO `actions` VALUES (1,'Unlock',1),(2,'Lock',1),(3,'Check Lock Status',1);
/*!40000 ALTER TABLE `actions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `age`
--

DROP TABLE IF EXISTS `age`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `age` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `age_range` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `age`
--

LOCK TABLES `age` WRITE;
/*!40000 ALTER TABLE `age` DISABLE KEYS */;
INSERT INTO `age` VALUES (1,'0-13'),(2,'14-19'),(3,'20-35'),(4,'36-55');
/*!40000 ALTER TABLE `age` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `category`
--

DROP TABLE IF EXISTS `category`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `category` (
  `category_id` int(11) NOT NULL AUTO_INCREMENT,
  `category_name` varchar(50) NOT NULL,
  PRIMARY KEY (`category_id`),
  UNIQUE KEY `category_name` (`category_name`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `category`
--

LOCK TABLES `category` WRITE;
/*!40000 ALTER TABLE `category` DISABLE KEYS */;
INSERT INTO `category` VALUES (1,'lockSystem');
/*!40000 ALTER TABLE `category` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `gender`
--

DROP TABLE IF EXISTS `gender`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `gender` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `gender_name` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `gender`
--

LOCK TABLES `gender` WRITE;
/*!40000 ALTER TABLE `gender` DISABLE KEYS */;
INSERT INTO `gender` VALUES (1,'Male'),(2,'Female'),(3,'Other');
/*!40000 ALTER TABLE `gender` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Temporary view structure for view `keyword_view`
--

DROP TABLE IF EXISTS `keyword_view`;
/*!50001 DROP VIEW IF EXISTS `keyword_view`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `keyword_view` AS SELECT 
 1 AS `Category`,
 1 AS `Action`,
 1 AS `Keyword`,
 1 AS `Question`,
 1 AS `Response`*/;
SET character_set_client = @saved_cs_client;

--
-- Table structure for table `keywords`
--

DROP TABLE IF EXISTS `keywords`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `keywords` (
  `keyword_id` int(11) NOT NULL AUTO_INCREMENT,
  `keyword_name` varchar(50) NOT NULL,
  `action_id` int(11) NOT NULL,
  PRIMARY KEY (`keyword_id`),
  UNIQUE KEY `keyword_name` (`keyword_name`),
  KEY `action_id` (`action_id`),
  CONSTRAINT `keywords_ibfk_1` FOREIGN KEY (`action_id`) REFERENCES `actions` (`action_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `keywords`
--

LOCK TABLES `keywords` WRITE;
/*!40000 ALTER TABLE `keywords` DISABLE KEYS */;
INSERT INTO `keywords` VALUES (1,'unlock',1),(2,'open lock',1),(3,'disable lock',1),(4,'unlatch',1),(5,'open door',1),(6,'something else',1),(7,'lock',2),(8,'secure lock',2),(9,'close lock',2),(10,'cabinet',2),(11,'status',3),(12,'is the door locked',3),(13,'is the lock engaged',3),(14,'main door',3),(15,'back door',3),(16,'front door',3);
/*!40000 ALTER TABLE `keywords` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `questions`
--

DROP TABLE IF EXISTS `questions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `questions` (
  `question_id` int(11) NOT NULL AUTO_INCREMENT,
  `action_id` int(11) NOT NULL,
  `question_text` text NOT NULL,
  PRIMARY KEY (`question_id`),
  KEY `action_id` (`action_id`),
  CONSTRAINT `questions_ibfk_1` FOREIGN KEY (`action_id`) REFERENCES `actions` (`action_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `questions`
--

LOCK TABLES `questions` WRITE;
/*!40000 ALTER TABLE `questions` DISABLE KEYS */;
INSERT INTO `questions` VALUES (1,1,'What do you want to unlock? A door, a lock, or something else?'),(2,2,'What do you want to lock? A door, a cabinet, a lock or something else?'),(3,3,'Which lock status do you want to check? Main door, back door, front door, or another lock?');
/*!40000 ALTER TABLE `questions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `responses`
--

DROP TABLE IF EXISTS `responses`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `responses` (
  `response_id` int(11) NOT NULL AUTO_INCREMENT,
  `keyword_id` int(11) NOT NULL,
  `response_text` text NOT NULL,
  PRIMARY KEY (`response_id`),
  KEY `keyword_id` (`keyword_id`),
  CONSTRAINT `responses_ibfk_1` FOREIGN KEY (`keyword_id`) REFERENCES `keywords` (`keyword_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `responses`
--

LOCK TABLES `responses` WRITE;
/*!40000 ALTER TABLE `responses` DISABLE KEYS */;
INSERT INTO `responses` VALUES (1,1,'Door is now unlocked.'),(2,2,'Opening the lock...'),(3,3,'Lock has been disabled.'),(4,4,'Unlatching the door...'),(5,5,'Opening the door...'),(6,6,'Please specify what you want to unlock.'),(7,7,'Securing the door...'),(8,8,'Locking mechanism engaged.'),(9,9,'Closing the lock...'),(10,10,'it is locked...'),(11,11,'Fetching lock status...'),(12,12,'Verifying if the door is locked...'),(13,13,'Checking if the lock is engaged...'),(14,14,'opening the main door...'),(15,15,'back door is opening...'),(16,16,'Opening the front door...');
/*!40000 ALTER TABLE `responses` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `status`
--

DROP TABLE IF EXISTS `status`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `status` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `status_name` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `status`
--

LOCK TABLES `status` WRITE;
/*!40000 ALTER TABLE `status` DISABLE KEYS */;
INSERT INTO `status` VALUES (1,'IN'),(2,'OUT');
/*!40000 ALTER TABLE `status` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_images`
--

DROP TABLE IF EXISTS `user_images`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_images` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `image_path` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `user_images_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_images`
--

LOCK TABLES `user_images` WRITE;
/*!40000 ALTER TABLE `user_images` DISABLE KEYS */;
INSERT INTO `user_images` VALUES (1,1,'captured_faces/650426fa-8db6-4752-a5b2-da7f54ea20d4/User1_20250421_185856_c29ad9e2.jpg','2025-04-21 13:28:58'),(2,1,'captured_faces/650426fa-8db6-4752-a5b2-da7f54ea20d4/User1_20250421_185902_d6f33fbb.jpg','2025-04-21 13:29:05'),(3,2,'captured_faces/650426fa-8db6-4752-a5b2-da7f54ea20d4/User2_20250421_185921_1eb68932.jpg','2025-04-21 13:29:24'),(4,3,'captured_faces/650426fa-8db6-4752-a5b2-da7f54ea20d4/User11_20250421_185932_7eb01835.jpg','2025-04-21 13:29:34'),(5,1,'captured_faces/e3fdacc5-e244-4516-9e8c-f1827c634062/User1_20250421_190527_5e708e8a.jpg','2025-04-21 13:35:29'),(6,1,'captured_faces/e3fdacc5-e244-4516-9e8c-f1827c634062/User1_20250421_190606_5c3001d8.jpg','2025-04-21 13:36:08'),(7,1,'captured_faces/e3fdacc5-e244-4516-9e8c-f1827c634062/User1_20250421_190619_69229a71.jpg','2025-04-21 13:36:20'),(8,1,'captured_faces/e3fdacc5-e244-4516-9e8c-f1827c634062/User1_20250421_190627_7ddf3ae1.jpg','2025-04-21 13:36:29'),(9,1,'captured_faces/e3fdacc5-e244-4516-9e8c-f1827c634062/User1_20250421_190635_99fd87ea.jpg','2025-04-21 13:36:37'),(10,2,'captured_faces/e3fdacc5-e244-4516-9e8c-f1827c634062/User2_20250421_190648_ac624136.jpg','2025-04-21 13:36:50'),(11,2,'captured_faces/e3fdacc5-e244-4516-9e8c-f1827c634062/User2_20250421_190707_f6f1452d.jpg','2025-04-21 13:37:09'),(12,2,'captured_faces/e3fdacc5-e244-4516-9e8c-f1827c634062/User2_20250421_190712_1b00158b.jpg','2025-04-21 13:37:13'),(13,2,'captured_faces/e3fdacc5-e244-4516-9e8c-f1827c634062/User2_20250421_190720_ef692b40.jpg','2025-04-21 13:37:22'),(14,4,'captured_faces/e3fdacc5-e244-4516-9e8c-f1827c634062/User6_20250421_190731_70605336.jpg','2025-04-21 13:37:32'),(15,4,'captured_faces/e3fdacc5-e244-4516-9e8c-f1827c634062/User6_20250421_190737_affde981.jpg','2025-04-21 13:37:39'),(16,1,'captured_faces/e3fdacc5-e244-4516-9e8c-f1827c634062/User1_20250421_190743_150937a6.jpg','2025-04-21 13:37:46'),(17,1,'captured_faces/e3fdacc5-e244-4516-9e8c-f1827c634062/User1_20250421_190752_343c9e1e.jpg','2025-04-21 13:37:54');
/*!40000 ALTER TABLE `user_images` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(255) NOT NULL,
  `status_id` int(11) DEFAULT NULL,
  `age_id` int(11) DEFAULT NULL,
  `gender_id` int(11) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `status_id` (`status_id`),
  KEY `age_id` (`age_id`),
  KEY `gender_id` (`gender_id`),
  CONSTRAINT `users_ibfk_1` FOREIGN KEY (`status_id`) REFERENCES `status` (`id`),
  CONSTRAINT `users_ibfk_2` FOREIGN KEY (`age_id`) REFERENCES `age` (`id`),
  CONSTRAINT `users_ibfk_3` FOREIGN KEY (`gender_id`) REFERENCES `gender` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'User1',1,2,1,'2025-04-21 13:28:58'),(2,'User2',1,2,1,'2025-04-21 13:29:23'),(3,'User11',1,2,1,'2025-04-21 13:29:34'),(4,'User6',1,2,1,'2025-04-21 13:37:32');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Final view structure for view `keyword_view`
--

/*!50001 DROP VIEW IF EXISTS `keyword_view`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_general_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`webinfinity_ajitnew`@`%` SQL SECURITY DEFINER */
/*!50001 VIEW `keyword_view` AS select `c`.`category_name` AS `Category`,`a`.`action_name` AS `Action`,`k`.`keyword_name` AS `Keyword`,`q`.`question_text` AS `Question`,`r`.`response_text` AS `Response` from ((((`category` `c` left join `actions` `a` on(`c`.`category_id` = `a`.`category_id`)) left join `keywords` `k` on(`a`.`action_id` = `k`.`action_id`)) left join `questions` `q` on(`a`.`action_id` = `q`.`action_id`)) left join `responses` `r` on(`k`.`keyword_id` = `r`.`keyword_id`)) */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-04-22 12:46:53
