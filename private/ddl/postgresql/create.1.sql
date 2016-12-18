create sequence seq_server_logs_id;

create table server_logs (
	id bigint not null default nextval('seq_server_logs_id') primary key,
	created timestamp not null,
	modified timestamp not null,
	server_name text not null,
	server_group text,
	error_code text,
	logged timestamp not null,
	description text,
	message text not null,
	severity text not null,
	context text
);