CREATE DATABASE IF NOT EXISTS video_game_collection CHARACTER SET utf8;

CREATE TABLE IF NOT EXISTS Console (
	id int NOT NULL AUTO_INCREMENT PRIMARY KEY,
	name VARCHAR(256) NOT NULL,
	console_type INT NOT NULL,
	model VARCHAR(64),
	region INT NOT NULL,
	release_date DATE,
	bought_date	DATE,
	company VARCHAR(64),
	product_condition INT NOT NULL,
	has_packaging BOOL NOT NULL,
	is_duplicate BOOL NOT NULL,
	has_cables BOOL NOT NULL,
	has_console BOOL NOT NULL,
	monetary_value DECIMAL(10,2),
	notes VARCHAR(1024)
);

CREATE TABLE IF NOT EXISTS Game (
	id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
	console_id INT NOT NULL,
	name VARCHAR(512) NOT NULL,
	edition VARCHAR(256),
	release_date DATE,
	bought_date DATE,
	region INT NOT NULL,
	developer VARCHAR(128),
	publisher VARCHAR(128),
	digital BOOL NOT NULL,
	has_game BOOL NOT NULL,
	has_manual BOOL NOT NULL,
	has_box	BOOL NOT NULL,
	is_duplicate BOOL NOT NULL,
	product_condition INT NOT NULL,
	monetary_value DECIMAL(10,2),
	notes VARCHAR(1024),
	FOREIGN KEY (console_id) REFERENCES Console(id)
);

CREATE TABLE IF NOT EXISTS Accessory (
	id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
	console_id INT NOT NULL,
	name VARCHAR(128) NOT NULL,
	model VARCHAR(128),
	accessory_type INT NOT NULL,
	release_date DATE,
	bought_date DATE,
	company VARCHAR(64),
	product_condition INT NOT NULL,
	has_packaging BOOL NOT NULL,
	monetary_value DECIMAL(10,2),
	notes VARCHAR(1024),
	FOREIGN KEY (console_id) REFERENCES Console(id)
);