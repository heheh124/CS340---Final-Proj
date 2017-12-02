DROP TABLE IF EXISTS `Handguns`;
DROP TABLE IF EXISTS `Rifles`;
DROP TABLE IF EXISTS `Ammunition`;
DROP TABLE IF EXISTS `Accessories`;

CREATE TABLE Handguns (
	handguns_id int(11) NOT NULL AUTO_INCREMENT,
	handguns_brand VARCHAR(255) NOT NULL,
	handguns_model VARCHAR (255) NOT NULL,
	handguns_caliber INT(11) NOT NULL,
	handguns_barrel_length INT(11) NOT NULL,
	PRIMARY KEY (handguns_id),
	UNIQUE KEY (handguns_model)
) ENGINE=InnoDB;

CREATE TABLE Rifles (
	rifles_id int(11) NOT NULL AUTO_INCREMENT,
	rifles_brand VARCHAR(255) NOT NULL,
	rifles_model VARCHAR (255) NOT NULL,
	rifles_caliber INT(11) NOT NULL,
	rifles_barrel_length INT(11) NOT NULL,
	PRIMARY KEY (rifles_id),
	UNIQUE KEY (rifles_model)
) ENGINE=InnoDB;

CREATE TABLE Ammunition (
	ammunition_id INT (11) NOT NULL AUTO_INCREMENT,
	ammunition_brand VARCHAR(255) NOT NULL,
	ammunition_model VARCHAR(255) NOT NULL,
	ammunition_caliber INT(11) NOT NULL,
	grain INT(11) NOT NULL,
	PRIMARY KEY (ammunition_id),
	CONSTRAINT fk_Handguns FOREIGN KEY (ammunition_caliber) REFERENCES Handguns (handguns_id) ON DELETE RESTRICT ON UPDATE CASCADE,
	CONSTRAINT fk_Rifles FOREIGN KEY (ammunition_caliber) REFERENCES Rifles (rifles_id) ON DELETE RESTRICT ON UPDATE CASCADE,
	UNIQUE KEY (ammunition_model)
	) ENGINE=InnoDB;

CREATE TABLE Accessories (
	accessories_id INT(11) NOT NULL AUTO_INCREMENT,
	accessories_brand VARCHAR(255) NOT NULL,
	accessories_model VARCHAR(255) NOT NULL,
	accessories_type VARCHAR(255) NOT NULL,
	compatibility VARCHAR(255) NOT NULL,
	PRIMARY KEY (accessories_id),
	UNIQUE KEY (accessories_model)
	) ENGINE=InnoDB;

INSERT INTO Handguns (handguns_brand, handguns_model, handguns_caliber, handguns_barrel_length) VALUES ('Beretta', '92FS Inox', '9mm', '5.1'), ('Glock', 'Glock 19', '9', '4.1'), ('Smith & Wesson', 'M&P Shield', '40', '3.1');

INSERT INTO Ammunition (ammunition_brand, ammunition_model, ammunition_caliber, grain) VALUES ('Aguila', '1E092110', '9mm', '124'), ('Magtech', 'WX2-620530', '9', '115'), ('Winchester', 'WX2-12050', '40', '180');
	
INSERT INTO Accessories (accessories_brand, accessories_model, accessories_type, compatibility) VALUES ('Vortex', 'Crossfire II', 'Scope', 'Rifles'),('Meprolight', 'Tru-Dot Sight', 'Sight', 'Handguns'),('Sightmark', 'G5 Pistol Laser', 'Laser', 'Handguns'),('Barska', 'LED 200 Lumen', 'Flashlight', 'Handguns'),('Caldwell', 'Pivot XLA Bipod', 'Bipod', 'Rifles'),('Urban Carry', 'G2 Holster', 'Holster', 'Handguns');
