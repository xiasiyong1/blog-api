# blog-api

- [x] 完成完整的登录注册
- [x] 实现 jwtGuard
- [ ] user/auth/role 完成
- [ ] article 完成
- [ ] comment 完成
- [ ] 文章推荐
- [ ] 标签和分类关联关系

docker run --name mysql -p 12000:3306 -e MYSQL_DATABASE=blog_project -e MYSQL_ROOT_PASSWORD=test1 -d mysql

mysql -u root -P 12000 -p test1

redis-cli -p 12001
