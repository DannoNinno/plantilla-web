CREATE TABLE `accesos_admin` (
	`ip_hash` text PRIMARY KEY NOT NULL,
	`fallos` integer DEFAULT 0 NOT NULL,
	`bloqueado_hasta` integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE `sesiones_admin` (
	`id` text PRIMARY KEY NOT NULL,
	`ultima_actividad` integer NOT NULL
);
--> statement-breakpoint
CREATE INDEX `sesiones_admin_actividad_idx` ON `sesiones_admin` (`ultima_actividad`);