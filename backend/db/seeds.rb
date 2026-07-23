admin_email = ENV.fetch("SEED_ADMIN_EMAIL", "admin@igreja.local")
admin_password = ENV.fetch("SEED_ADMIN_PASSWORD", "senha12345")

User.find_or_create_by!(email: admin_email) do |user|
  user.name = "Administrador"
  user.password = admin_password
  user.role = :admin
end

puts "Admin de desenvolvimento: #{admin_email} / #{admin_password}"

Ministry.find_or_create_by!(name: "Louvor")
