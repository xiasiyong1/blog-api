# blog-api

- [x] 完成完整的登录注册
- [x] 实现 jwtGuard
- [ ] user/auth/role 完成
- [ ] article 完成
- [ ] comment 完成
- [ ] 文章推荐
- [ ] 标签和分类关联关系

docker run --name mysql -p 12000:3306 -e LANG=C.UTF-8 -e MYSQL_DATABASE=blog_project -e MYSQL_ROOT_PASSWORD=muSuT66G021oiWWZOqwHGEYnloiRUSOk -d mysql

docker run --name redis -p 12001:6379 -d redis

mysql -u root -P 12000 -p muSuT66G021oiWWZOqwHGEYnloiRUSOk

redis-cli -p 12001

mysql -uroot -pmuSuT66G021oiWWZOqwHGEYnloiRUSOk --default-character-set=utf8 blog_project
