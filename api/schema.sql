-- ============================================================
-- Inédito Digital — esquema completo de la base de datos
--
-- Generado desde el volcado de producción del 14-08-2026.
-- Solo ESTRUCTURA: no incluye datos. Los leads y los pageviews son
-- datos personales y no deben vivir en el repositorio.
--
-- Restaurar en un entorno nuevo:
--   mysql -u USUARIO -p BASE_DE_DATOS < api/schema.sql
--
-- OJO: las tablas admins, pageviews y google_auth, y la columna data_json
-- de services/blog_posts/portfolio, no las creaba ningún script del
-- proyecto. Vivían solo en la base de producción. Este archivo cierra ese
-- hueco: a partir de aquí la BD se puede reconstruir desde el repositorio.
-- ============================================================

SET NAMES utf8mb4;
SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";

-- ------------------------------------------------------------
-- Tabla: admins
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `admins` (
  `id` int(10) UNSIGNED NOT NULL,
  `username` varchar(60) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

ALTER TABLE `admins`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uq_username` (`username`);
ALTER TABLE `admins`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

-- ------------------------------------------------------------
-- Tabla: blog_posts
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `blog_posts` (
  `id` int(10) UNSIGNED NOT NULL,
  `slug` varchar(190) DEFAULT NULL,
  `title` varchar(200) DEFAULT NULL,
  `category` varchar(120) DEFAULT NULL,
  `author` varchar(120) DEFAULT NULL,
  `image` text DEFAULT NULL,
  `read_time` varchar(40) DEFAULT NULL,
  `publish_date` date DEFAULT NULL,
  `excerpt` text DEFAULT NULL,
  `content` mediumtext DEFAULT NULL,
  `meta_title` varchar(200) DEFAULT NULL,
  `meta_desc` varchar(300) DEFAULT NULL,
  `keywords` text DEFAULT NULL,
  `status` varchar(20) NOT NULL DEFAULT 'draft',
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `data_json` longtext DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

ALTER TABLE `blog_posts`
  ADD PRIMARY KEY (`id`);
ALTER TABLE `blog_posts`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

-- ------------------------------------------------------------
-- Tabla: google_auth
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `google_auth` (
  `k` varchar(40) NOT NULL,
  `v` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

ALTER TABLE `google_auth`
  ADD PRIMARY KEY (`k`);

-- ------------------------------------------------------------
-- Tabla: leads
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `leads` (
  `id` int(10) UNSIGNED NOT NULL,
  `name` varchar(150) NOT NULL,
  `email` varchar(190) NOT NULL,
  `phone` varchar(50) NOT NULL,
  `company` varchar(150) DEFAULT NULL,
  `service` varchar(150) DEFAULT NULL,
  `industry` varchar(150) DEFAULT NULL,
  `objective` text DEFAULT NULL,
  `urgency` varchar(100) DEFAULT NULL,
  `budget` varchar(100) DEFAULT NULL,
  `has_site` varchar(50) DEFAULT NULL,
  `message` text DEFAULT NULL,
  `source` varchar(100) NOT NULL DEFAULT 'Formulario de contacto web',
  `status` enum('new','contacted','qualified','converted','lost') NOT NULL DEFAULT 'new',
  `ip` varchar(45) DEFAULT NULL,
  `user_agent` varchar(255) DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `notes` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

ALTER TABLE `leads`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_created` (`created_at`),
  ADD KEY `idx_status` (`status`);
ALTER TABLE `leads`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

-- ------------------------------------------------------------
-- Tabla: pageviews
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `pageviews` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `path` varchar(255) NOT NULL,
  `referrer` varchar(255) DEFAULT NULL,
  `source` varchar(20) NOT NULL DEFAULT 'direct',
  `visitor` varchar(40) NOT NULL,
  `session` varchar(40) NOT NULL,
  `device` varchar(12) NOT NULL DEFAULT 'desktop',
  `browser` varchar(30) DEFAULT NULL,
  `is_new` tinyint(4) NOT NULL DEFAULT 0,
  `created_at` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

ALTER TABLE `pageviews`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_created` (`created_at`),
  ADD KEY `idx_path` (`path`(120)),
  ADD KEY `idx_visitor` (`visitor`),
  ADD KEY `idx_source` (`source`);
ALTER TABLE `pageviews`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=323;

-- ------------------------------------------------------------
-- Tabla: portfolio
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `portfolio` (
  `id` int(10) UNSIGNED NOT NULL,
  `slug` varchar(190) DEFAULT NULL,
  `title` varchar(200) DEFAULT NULL,
  `client` varchar(160) DEFAULT NULL,
  `category` varchar(120) DEFAULT NULL,
  `image` text DEFAULT NULL,
  `short_desc` text DEFAULT NULL,
  `full_desc` text DEFAULT NULL,
  `gallery` text DEFAULT NULL,
  `challenge` text DEFAULT NULL,
  `solution` text DEFAULT NULL,
  `results` text DEFAULT NULL,
  `testimonial` text DEFAULT NULL,
  `testimonial_author` varchar(160) DEFAULT NULL,
  `testimonial_role` varchar(160) DEFAULT NULL,
  `meta_title` varchar(200) DEFAULT NULL,
  `meta_desc` varchar(300) DEFAULT NULL,
  `keywords` text DEFAULT NULL,
  `status` varchar(20) NOT NULL DEFAULT 'draft',
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `data_json` longtext DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

ALTER TABLE `portfolio`
  ADD PRIMARY KEY (`id`);
ALTER TABLE `portfolio`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

-- ------------------------------------------------------------
-- Tabla: seo_settings
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `seo_settings` (
  `k` varchar(60) NOT NULL,
  `v` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

ALTER TABLE `seo_settings`
  ADD PRIMARY KEY (`k`);

-- ------------------------------------------------------------
-- Tabla: services
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `services` (
  `id` int(10) UNSIGNED NOT NULL,
  `slug` varchar(190) DEFAULT NULL,
  `title` varchar(200) DEFAULT NULL,
  `category` varchar(120) DEFAULT NULL,
  `price` varchar(80) DEFAULT NULL,
  `image` text DEFAULT NULL,
  `short_desc` text DEFAULT NULL,
  `full_desc` text DEFAULT NULL,
  `features` text DEFAULT NULL,
  `benefits` text DEFAULT NULL,
  `meta_title` varchar(200) DEFAULT NULL,
  `meta_desc` varchar(300) DEFAULT NULL,
  `keywords` text DEFAULT NULL,
  `status` varchar(20) NOT NULL DEFAULT 'draft',
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `data_json` longtext DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

ALTER TABLE `services`
  ADD PRIMARY KEY (`id`);
ALTER TABLE `services`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

-- ------------------------------------------------------------
-- Tabla: site_settings
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `site_settings` (
  `k` varchar(60) NOT NULL,
  `v` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

ALTER TABLE `site_settings`
  ADD PRIMARY KEY (`k`);



-- ------------------------------------------------------------
-- CMS · Fase 1: contenido editable de las páginas
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `pages` (
  `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  `slug` varchar(190) NOT NULL,
  `nombre` varchar(160) NOT NULL,
  `ruta` varchar(190) NOT NULL,
  `tipo` varchar(20) NOT NULL DEFAULT 'codigo',
  `contenido` mediumtext DEFAULT NULL,
  `borrador` mediumtext DEFAULT NULL,
  `seo_title` varchar(200) DEFAULT NULL,
  `seo_desc` varchar(300) DEFAULT NULL,
  `seo_image` text DEFAULT NULL,
  `en_menu` tinyint(4) NOT NULL DEFAULT 0,
  `orden` int(11) NOT NULL DEFAULT 0,
  `status` varchar(20) NOT NULL DEFAULT 'published',
  `updated_at` datetime DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `uniq_slug` (`slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `page_versions` (
  `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  `page_id` int(10) UNSIGNED NOT NULL,
  `contenido` mediumtext DEFAULT NULL,
  `autor` varchar(60) DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_page` (`page_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `media` (
  `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  `archivo` varchar(255) NOT NULL,
  `alt` varchar(255) DEFAULT NULL,
  `ancho` int(11) DEFAULT NULL,
  `alto` int(11) DEFAULT NULL,
  `peso` int(11) DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
