
use nodejs

CREATE TABLE IF NOT EXISTS `nodejs`(
	`id` int NOT NULL PRIMARY KEY AUTO_INCREMENT,
	`task` VARCHAR(255) NOT NULL,
	`completed` BOOLEAN DEFAULT false,
	`date_created` datetime DEFAULT CURRENT_TIME()
	);

-- *************************** 1. row ***************************
--Table: nodejs
--Create Table: CREATE TABLE `nodejs` (
--`id` int(11) NOT NULL AUTO_INCREMENT,
--`task` varchar(255) NOT NULL,
--`completed` tinyint(1) DEFAULT 0,
--`date_created` datetime DEFAULT curtime(),
--PRIMARY KEY (`id`)
--) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
