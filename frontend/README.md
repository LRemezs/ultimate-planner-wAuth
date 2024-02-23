### Data base tables for UPDB1

CREATE TABLE `users` (
`user_id` int NOT NULL AUTO_INCREMENT,
`name` varchar(45) NOT NULL,
`email` varchar(255) NOT NULL,
`password` varchar(1000) NOT NULL,
PRIMARY KEY (`user_id`),
UNIQUE KEY `email_UNIQUE` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci

CREATE TABLE `subscriptions` (
`subscription_id` int NOT NULL AUTO_INCREMENT,
`s_name` varchar(45) NOT NULL,
PRIMARY KEY (`subscription_id`),
UNIQUE KEY `subscribtion_id_UNIQUE` (`subscription_id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci

CREATE TABLE `user_subscriptions` (
`user_subscription_id` int NOT NULL AUTO_INCREMENT,
`user_id` int NOT NULL,
`subscription_id` int NOT NULL,
`start_date` date NOT NULL,
`end_date` date DEFAULT NULL,
PRIMARY KEY (`user_subscription_id`),
UNIQUE KEY `user_subscribtion_id_UNIQUE` (`user_subscription_id`),
KEY `fk_user_subscriptions_user_id_idx` (`user_id`),
KEY `fk_user_subscriptions_sub_id_idx` (`subscription_id`),
CONSTRAINT `fk_user_subscriptions_sub_id` FOREIGN KEY (`subscription_id`) REFERENCES `subscriptions` (`subscription_id`),
CONSTRAINT `fk_user_subscriptions_user_id` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci

CREATE TABLE `user_subscription_timings` (
`user_sub_timing_id` int NOT NULL AUTO_INCREMENT,
`user_subscription_id` int NOT NULL,
`day_of_week` int NOT NULL,
`start_time` time NOT NULL,
`end_time` time NOT NULL,
PRIMARY KEY (`user_sub_timing_id`),
UNIQUE KEY `user_sub_timing_id_UNIQUE` (`user_sub_timing_id`),
KEY `ust_subscription_id_fk_idx` (`user_subscription_id`),
CONSTRAINT `ust_subscription_id_fk` FOREIGN KEY (`user_subscription_id`) REFERENCES `user_subscriptions` (`user_subscription_id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE=InnoDB AUTO_INCREMENT=243 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci

CREATE TABLE `events` (
`event_id` int NOT NULL AUTO_INCREMENT,
`user_id` int NOT NULL,
`title` varchar(255) NOT NULL,
`start_time` datetime NOT NULL,
`end_time` datetime NOT NULL,
`description` text NOT NULL,
`location` varchar(255) NOT NULL,
`type` varchar(50) NOT NULL,
`created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
`updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
PRIMARY KEY (`event_id`),
UNIQUE KEY `event_id_UNIQUE` (`event_id`),
KEY `events_ibfk_1` (`user_id`),
CONSTRAINT `events_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE=InnoDB AUTO_INCREMENT=44 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci

CREATE TABLE `repeating_event_entries` (
`r_entry_id` int NOT NULL AUTO_INCREMENT,
`user_id` int NOT NULL,
`title` varchar(255) NOT NULL,
`type` varchar(45) NOT NULL,
`start_time` datetime NOT NULL,
`end_time` datetime NOT NULL,
PRIMARY KEY (`r_entry_id`),
UNIQUE KEY `running_e_id_UNIQUE` (`r_entry_id`),
KEY `fk_running_event_entries_user_id1_idx` (`user_id`),
CONSTRAINT `fk_running_event_entries_user_id1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=31 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci

CREATE TABLE `runing_event_entry_data` (
`r_entry_id` int NOT NULL,
`run_time_minutes` decimal(10,3) DEFAULT NULL,
`run_distance_km` decimal(10,2) DEFAULT NULL,
PRIMARY KEY (`r_entry_id`),
UNIQUE KEY `running_e_id_UNIQUE` (`r_entry_id`),
CONSTRAINT `fk_runing_event_entry_id_to_data` FOREIGN KEY (`r_entry_id`) REFERENCES `repeating_event_entries` (`r_entry_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci

CREATE TABLE `gym_u_workout_types` (
`workout_type_id` int NOT NULL AUTO_INCREMENT,
`user_id` int NOT NULL,
`workout_name` varchar(255) NOT NULL,
PRIMARY KEY (`workout_type_id`),
UNIQUE KEY `workout_type_id_UNIQUE` (`workout_type_id`),
KEY `fk_gym_u_workout_types_1_idx` (`user_id`),
CONSTRAINT `fk_gym_u_workout_types_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci

CREATE TABLE `gym_u_exercises` (
`exercise_id` int NOT NULL AUTO_INCREMENT,
`workout_type_id` int NOT NULL,
`exercise_name` varchar(255) NOT NULL,
PRIMARY KEY (`exercise_id`),
UNIQUE KEY `exercise_id_UNIQUE` (`exercise_id`),
KEY `fk_gym_u_exercises_1_idx` (`workout_type_id`),
CONSTRAINT `fk_gym_u_exercises_1` FOREIGN KEY (`workout_type_id`) REFERENCES `gym_u_workout_types` (`workout_type_id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci

CREATE TABLE `gym_event_entry_data` (
`gym_data_id` int NOT NULL AUTO_INCREMENT,
`r_entry_id` int NOT NULL,
`exercise_id` int NOT NULL,
`set_number` int NOT NULL,
`reps` int NOT NULL,
`weight` float NOT NULL,
PRIMARY KEY (`gym_data_id`),
UNIQUE KEY `r_entry_id_UNIQUE` (`gym_data_id`),
KEY `fk_gym_event_entry_data_1_idx` (`r_entry_id`),
KEY `fk_gym_event_entry_data_2_idx` (`exercise_id`),
CONSTRAINT `fk_gym_event_entry_data_1` FOREIGN KEY (`r_entry_id`) REFERENCES `repeating_event_entries` (`r_entry_id`),
CONSTRAINT `fk_gym_event_entry_data_2` FOREIGN KEY (`exercise_id`) REFERENCES `gym_u_exercises` (`exercise_id`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci
