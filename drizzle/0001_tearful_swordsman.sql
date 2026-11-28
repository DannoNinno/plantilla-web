PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_solicitudes` (
	`id` text PRIMARY KEY NOT NULL,
	`tipo` text NOT NULL,
	`nombre` text NOT NULL,
	`email` text,
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
	CONSTRAINT "solicitudes_tipo_check" CHECK("__new_solicitudes"."tipo" IN ('consulta', 'cotizacion')),
	CONSTRAINT "solicitudes_estado_check" CHECK("__new_solicitudes"."estado_aviso" IN ('pendiente', 'enviado', 'fallido'))
);
--> statement-breakpoint
INSERT INTO `__new_solicitudes`("id", "tipo", "nombre", "email", "datos", "estado_aviso", "intentos_aviso", "ultimo_error", "ip_hash", "leida", "creado_en", "avisado_en", "reserva_token", "reserva_hasta") SELECT "id", "tipo", "nombre", "email", "datos", "estado_aviso", "intentos_aviso", "ultimo_error", "ip_hash", "leida", "creado_en", "avisado_en", "reserva_token", "reserva_hasta" FROM `solicitudes`;--> statement-breakpoint
DROP TABLE `solicitudes`;--> statement-breakpoint
ALTER TABLE `__new_solicitudes` RENAME TO `solicitudes`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE INDEX `solicitudes_creado_idx` ON `solicitudes` (`creado_en`);--> statement-breakpoint
CREATE INDEX `solicitudes_ip_creado_idx` ON `solicitudes` (`ip_hash`,`creado_en`);--> statement-breakpoint
CREATE INDEX `solicitudes_estado_idx` ON `solicitudes` (`estado_aviso`);