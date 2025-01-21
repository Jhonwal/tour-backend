-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1
-- Généré le : jeu. 02 jan. 2025 à 23:47
-- Version du serveur : 10.4.32-MariaDB
-- Version de PHP : 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `tourism`
--

-- --------------------------------------------------------

--
-- Structure de la table `activites`
--

CREATE TABLE `activites` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `activity_name` text NOT NULL,
  `activity_description` text NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `bookings`
--

CREATE TABLE `bookings` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `full_name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `country` varchar(255) NOT NULL,
  `region` varchar(255) NOT NULL,
  `number_of_adults` int(11) NOT NULL,
  `number_of_children` int(11) DEFAULT 0,
  `number_of_rooms` int(11) NOT NULL,
  `arrival_date` date NOT NULL,
  `tour_level` enum('3-stars','4-stars','4&5-stars','5-stars') NOT NULL,
  `special_requests` text DEFAULT NULL,
  `status` enum('pending','confirmed','canceled','completed') DEFAULT 'pending',
  `total_price` decimal(10,2) DEFAULT NULL,
  `discount` decimal(5,2) DEFAULT 0.00,
  `reference_code` varchar(255) NOT NULL,
  `tour_id` bigint(20) UNSIGNED NOT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `day_images`
--

CREATE TABLE `day_images` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `url` varchar(255) NOT NULL,
  `day_id` bigint(20) UNSIGNED NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `destinations`
--

CREATE TABLE `destinations` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `number_of_nights` int(10) UNSIGNED NOT NULL,
  `tour_id` bigint(20) UNSIGNED NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `services`
--

CREATE TABLE `services` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `services` text NOT NULL,
  `services_description` text NOT NULL,
  `type` varchar(255) NOT NULL,
  `tour_id` bigint(20) UNSIGNED NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `testimonials`
--

CREATE TABLE `testimonials` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `message` text NOT NULL,
  `rating` tinyint(3) UNSIGNED NOT NULL,
  `avatar` varchar(255) NOT NULL DEFAULT '/storage/testemonial/default.png',
  `state` varchar(255) NOT NULL DEFAULT 'pending',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `tours`
--

CREATE TABLE `tours` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `depart_city` varchar(255) NOT NULL,
  `end_city` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `map_image` varchar(255) NOT NULL,
  `banner` varchar(255) NOT NULL,
  `duration` int(10) UNSIGNED NOT NULL,
  `tour_type_id` bigint(20) UNSIGNED NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `tour_activites`
--

CREATE TABLE `tour_activites` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `tour_id` bigint(20) UNSIGNED NOT NULL,
  `tour_day_id` bigint(20) UNSIGNED NOT NULL,
  `activite_id` bigint(20) UNSIGNED NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `tour_days`
--

CREATE TABLE `tour_days` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `number` decimal(8,0) NOT NULL,
  `description` text DEFAULT NULL,
  `tour_id` bigint(20) UNSIGNED NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `tour_images`
--

CREATE TABLE `tour_images` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `url` varchar(255) NOT NULL,
  `tour_id` bigint(20) UNSIGNED NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `tour_prices`
--

CREATE TABLE `tour_prices` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `3-stars|2` double NOT NULL,
  `4-stars|2` double NOT NULL,
  `4&5-stars|2` double NOT NULL,
  `5-stars|2` double NOT NULL,
  `3-stars|3-4` double NOT NULL,
  `4-stars|3-4` double NOT NULL,
  `4&5-stars|3-4` double NOT NULL,
  `5-stars|3-4` double NOT NULL,
  `3-stars|5<n` double NOT NULL,
  `4-stars|5<n` double NOT NULL,
  `4&5-stars|5<n` double NOT NULL,
  `5-stars|5<n` double NOT NULL,
  `tour_id` bigint(20) UNSIGNED NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `tour_types`
--

CREATE TABLE `tour_types` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` varchar(255) NOT NULL,
  `image` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `users`
--

CREATE TABLE `users` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `remember_token` varchar(100) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `visitor_counts`
--

CREATE TABLE `visitor_counts` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `month` int(11) NOT NULL,
  `year` int(11) NOT NULL,
  `country` varchar(255) NOT NULL DEFAULT '0',
  `count` int(11) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `visitor_counts`
--

INSERT INTO `visitor_counts` (`id`, `month`, `year`, `country`, `count`, `created_at`, `updated_at`) VALUES
(2, 8, 2024, 'Morocco', 55, '2024-08-14 14:04:59', '2024-08-28 14:27:44'),
(3, 8, 2024, 'United States of America', 42, '2024-08-14 14:20:12', '2024-08-14 22:57:53'),
(4, 8, 2024, 'Sweden', 19, '2024-08-14 18:12:31', '2024-08-14 18:12:31'),
(5, 8, 2024, 'China', 14, '2024-08-14 18:12:31', '2024-08-14 18:12:31'),
(6, 8, 2024, 'Canada', 30, '2024-08-01 10:00:00', '2024-08-01 10:00:00'),
(7, 8, 2024, 'United Kingdom', 40, '2024-08-01 11:00:00', '2024-08-01 11:00:00'),
(8, 8, 2024, 'Australia', 22, '2024-08-01 12:00:00', '2024-08-01 12:00:00'),
(9, 8, 2024, 'Germany', 35, '2024-08-01 13:00:00', '2024-08-01 13:00:00'),
(10, 8, 2024, 'India', 45, '2024-08-01 14:00:00', '2024-08-01 14:00:00'),
(11, 7, 2024, 'Australia', 302, '2024-08-14 19:06:07', '2024-08-14 19:06:07'),
(12, 9, 2024, 'Morocco', 76, '2024-09-02 14:36:26', '2024-09-16 13:27:37'),
(13, 9, 2024, 'United States of America', 1, '2024-09-08 17:41:56', '2024-09-08 17:41:56'),
(14, 10, 2024, 'Morocco', 7, '2024-10-31 15:13:50', '2024-10-31 15:44:39'),
(15, 11, 2024, 'Morocco', 4, '2024-11-03 13:36:21', '2024-11-17 13:22:06'),
(16, 11, 2024, 'United States of America', 1, '2024-11-17 15:43:51', '2024-11-17 15:43:51'),
(17, 12, 2024, 'Morocco', 3, '2024-12-01 15:12:27', '2024-12-12 19:02:19'),
(18, 12, 2024, 'United States of America', 4, '2024-12-12 19:01:20', '2024-12-12 19:01:37'),
(19, 12, 2024, 'Germany', 4, '2024-12-12 19:01:54', '2024-12-12 19:02:05');

--
-- Index pour les tables déchargées
--

--
-- Index pour la table `activites`
--
ALTER TABLE `activites`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `bookings`
--
ALTER TABLE `bookings`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `reference_code` (`reference_code`),
  ADD KEY `fk_tour_id` (`tour_id`);

--
-- Index pour la table `day_images`
--
ALTER TABLE `day_images`
  ADD PRIMARY KEY (`id`),
  ADD KEY `day_images_day_id_foreign` (`day_id`);

--
-- Index pour la table `destinations`
--
ALTER TABLE `destinations`
  ADD PRIMARY KEY (`id`),
  ADD KEY `destinations_tour_id_foreign` (`tour_id`);

--
-- Index pour la table `services`
--
ALTER TABLE `services`
  ADD PRIMARY KEY (`id`),
  ADD KEY `services_tour_id_foreign` (`tour_id`);

--
-- Index pour la table `testimonials`
--
ALTER TABLE `testimonials`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `tours`
--
ALTER TABLE `tours`
  ADD PRIMARY KEY (`id`),
  ADD KEY `tours_tour_type_id_foreign` (`tour_type_id`);

--
-- Index pour la table `tour_activites`
--
ALTER TABLE `tour_activites`
  ADD PRIMARY KEY (`id`),
  ADD KEY `tour_activites_tour_id_foreign` (`tour_id`),
  ADD KEY `tour_activites_tour_day_id_foreign` (`tour_day_id`),
  ADD KEY `tour_activites_activite_id_foreign` (`activite_id`);

--
-- Index pour la table `tour_days`
--
ALTER TABLE `tour_days`
  ADD PRIMARY KEY (`id`),
  ADD KEY `tour_days_tour_id_foreign` (`tour_id`);

--
-- Index pour la table `tour_images`
--
ALTER TABLE `tour_images`
  ADD PRIMARY KEY (`id`),
  ADD KEY `tour_images_tour_id_foreign` (`tour_id`);

--
-- Index pour la table `tour_prices`
--
ALTER TABLE `tour_prices`
  ADD PRIMARY KEY (`id`),
  ADD KEY `tour_prices_tour_id_foreign` (`tour_id`);

--
-- Index pour la table `tour_types`
--
ALTER TABLE `tour_types`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `users_email_unique` (`email`);

--
-- Index pour la table `visitor_counts`
--
ALTER TABLE `visitor_counts`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT pour les tables déchargées
--

--
-- AUTO_INCREMENT pour la table `activites`
--
ALTER TABLE `activites`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `bookings`
--
ALTER TABLE `bookings`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `day_images`
--
ALTER TABLE `day_images`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `destinations`
--
ALTER TABLE `destinations`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `services`
--
ALTER TABLE `services`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `testimonials`
--
ALTER TABLE `testimonials`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `tours`
--
ALTER TABLE `tours`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `tour_activites`
--
ALTER TABLE `tour_activites`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `tour_days`
--
ALTER TABLE `tour_days`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `tour_images`
--
ALTER TABLE `tour_images`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `tour_prices`
--
ALTER TABLE `tour_prices`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `tour_types`
--
ALTER TABLE `tour_types`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `visitor_counts`
--
ALTER TABLE `visitor_counts`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- Contraintes pour les tables déchargées
--

--
-- Contraintes pour la table `bookings`
--
ALTER TABLE `bookings`
  ADD CONSTRAINT `fk_tour_id` FOREIGN KEY (`tour_id`) REFERENCES `tours` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `day_images`
--
ALTER TABLE `day_images`
  ADD CONSTRAINT `day_images_day_id_foreign` FOREIGN KEY (`day_id`) REFERENCES `tour_days` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `destinations`
--
ALTER TABLE `destinations`
  ADD CONSTRAINT `destinations_tour_id_foreign` FOREIGN KEY (`tour_id`) REFERENCES `tours` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `services`
--
ALTER TABLE `services`
  ADD CONSTRAINT `services_tour_id_foreign` FOREIGN KEY (`tour_id`) REFERENCES `tours` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `tours`
--
ALTER TABLE `tours`
  ADD CONSTRAINT `tours_tour_type_id_foreign` FOREIGN KEY (`tour_type_id`) REFERENCES `tour_types` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `tour_activites`
--
ALTER TABLE `tour_activites`
  ADD CONSTRAINT `tour_activites_activite_id_foreign` FOREIGN KEY (`activite_id`) REFERENCES `activites` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `tour_activites_tour_day_id_foreign` FOREIGN KEY (`tour_day_id`) REFERENCES `tour_days` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `tour_activites_tour_id_foreign` FOREIGN KEY (`tour_id`) REFERENCES `tours` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `tour_days`
--
ALTER TABLE `tour_days`
  ADD CONSTRAINT `tour_days_tour_id_foreign` FOREIGN KEY (`tour_id`) REFERENCES `tours` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `tour_images`
--
ALTER TABLE `tour_images`
  ADD CONSTRAINT `tour_images_tour_id_foreign` FOREIGN KEY (`tour_id`) REFERENCES `tours` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `tour_prices`
--
ALTER TABLE `tour_prices`
  ADD CONSTRAINT `tour_prices_tour_id_foreign` FOREIGN KEY (`tour_id`) REFERENCES `tours` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
