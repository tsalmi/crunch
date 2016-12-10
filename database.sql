CREATE TABLE `viski`.`evaluation` (
  `product` INT NOT NULL,
  `savuisuus` INT NULL,
  `vaniljaisuus` INT NULL,
  `kukkaisuus` INT NULL,
  `mausteisuus` INT NULL,
  `maltaisuus` INT NULL,
  `makeus` INT NULL,
  `miellyttavyys` INT NULL,
  `login` VARCHAR(24) NULL,
  PRIMARY KEY (`product`));

ALTER TABLE `viski`.`evaluation` 
CHANGE COLUMN `login` `login` VARCHAR(24) NOT NULL ,
DROP PRIMARY KEY,
ADD PRIMARY KEY (`product`, `login`);

create table viski.userdata (
login varchar(24) primary key,
nickname varchar(48)
);