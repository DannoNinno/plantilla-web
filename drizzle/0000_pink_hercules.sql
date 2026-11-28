CREATE TABLE `intentos_acceso` (
	`id` text PRIMARY KEY NOT NULL,
	`ip_hash` text NOT NULL,
	`creado_en` text NOT NULL
);
--> statement-breakpoint
CREATE INDEX `intentos_acceso_ip_fecha_idx` ON `intentos_acceso` (`ip_hash`,`creado_en`);--> statement-breakpoint
CREATE TABLE `solicitudes` (
	`id` text PRIMARY KEY NOT NULL,
	`tipo` text NOT NULL,
	`nombre` text NOT NULL,
	`email` text NOT NULL,
	`datos` text NOT NULL,
	`estado_aviso` text DEFAULT 'pendiente' NOT NULL,
	`intentos_aviso` integer DEFAULT 0 NOT NULL,
	`ultimo_error` text,
	`ip_hash` text NOT NULL,
	`leida` integer DEFAULT false NOT NULL,
	`creado_en` text NOT NULL,
	`avisado_en` text,
	`reserva_token` text,
	`reserva_hasta` text,
	CONSTRAINT "solicitudes_tipo_check" CHECK("solicitudes"."tipo" IN ('consulta', 'cotizacion')),
	CONSTRAINT "solicitudes_estado_check" CHECK("solicitudes"."estado_aviso" IN ('pendiente', 'enviado', 'fallido'))
);
--> statement-breakpoint
CREATE INDEX `solicitudes_creado_idx` ON `solicitudes` (`creado_en`);--> statement-breakpoint
CREATE INDEX `solicitudes_ip_creado_idx` ON `solicitudes` (`ip_hash`,`creado_en`);--> statement-breakpoint
CREATE INDEX `solicitudes_estado_idx` ON `solicitudes` (`estado_aviso`);