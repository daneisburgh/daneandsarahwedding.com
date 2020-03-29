# provider.tf

# Specify the provider and access details
provider "aws" {
  shared_credentials_file = var.aws_credentials_file
  profile                 = var.aws_profile
  region                  = var.aws_region
}

