data "aws_subnet_ids" "all" {
  vpc_id = data.aws_vpc.default.id
}

module "rds_aurora" {
  source = "terraform-aws-modules/rds-aurora/aws"

  name          = "${var.app_name}-${var.app_env}"
  database_name = var.app_name
  username      = var.db_username
  password      = var.db_password
  instance_type = var.db_instance_type

  engine         = "aurora-postgresql"
  engine_mode    = "serverless"
  engine_version = "10.7"

  replica_scale_enabled = false
  replica_count         = 0

  subnets = data.aws_subnet_ids.all.ids
  vpc_id  = data.aws_vpc.default.id

  monitoring_interval             = 60
  apply_immediately               = true
  skip_final_snapshot             = true
  storage_encrypted               = true
  db_parameter_group_name         = "default.aurora-postgresql10"
  db_cluster_parameter_group_name = "default.aurora-postgresql10"

  scaling_configuration = {
    auto_pause               = true
    max_capacity             = 2
    min_capacity             = 2
    seconds_until_auto_pause = 300
    timeout_action           = "ForceApplyCapacityChange"
  }
}

resource "aws_security_group_rule" "allow_access" {
  type                     = "ingress"
  from_port                = module.rds_aurora.this_rds_cluster_port
  to_port                  = module.rds_aurora.this_rds_cluster_port
  protocol                 = "tcp"
  source_security_group_id = module.rds_aurora.this_security_group_id
  security_group_id        = module.rds_aurora.this_security_group_id
}
