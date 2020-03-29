# variables.tf

data "aws_vpc" "default" {
  default = true
}

variable "module_path" {
  default     = "../../module"
  type        = string
  description = "Path to module from source directory"
}

variable "aws_credentials_file" {
  default     = "$HOME/.aws/credentials"
  type        = string
  description = "AWS credentials file path"
}

variable "aws_profile" {
  default     = "default"
  type        = string
  description = "AWS credentials profile"
}

variable "aws_region" {
  default     = "us-east-1"
  type        = string
  description = "AWS region things are created in"
}

variable "app_name" {
  type        = string
  description = "Application name"
}

variable "app_env" {
  type        = string
  description = "Application environment"
}

variable "db_instance_type" {
  type        = string
  description = "Database server instance type"
}

variable "db_username" {
  type        = string
  description = "Database username"
}

variable "db_password" {
  type        = string
  description = "Database password"
}
