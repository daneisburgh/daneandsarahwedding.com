variable "app_name" {}
variable "db_username" {}
variable "db_password" {}

module "app" {
  source = "../../module"

  app_name    = var.app_name
  app_env     = "stage"
  db_username = var.db_username
  db_password = var.db_password
}
