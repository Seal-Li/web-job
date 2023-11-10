# 项目主题
青岛啤酒用户管理平台




## 项目介绍
集啤酒平台管理员、供应商、消费者于一体的平台。

提供管理员管理（超级管理员权限）、用户管理、经销商管理模块。

提供用户注册、登录、找回密码、修改密码、修改用户个人信息功能、用户注销(删除)；该功能仅针对普通用户开放。

提供经销商商注册、登录、找回密码、修改密码、修改经销商个人信息功能、经销商注销(删除)。该功能仅针对经销商开放。

提供产品信息添加、产品信息更新、产品信息删除、产品信息查询功能；该功能仅针对管理员和超级管理员开放。

提供订单信息添加、订单信息更新、订单信息删除、订单信息查询功能；该功能仅针对普通用户开放。

提供啤酒知识分享、论坛、啤酒活动等功能；功能对所有用户、权限开放。

### 超级管理员
权限：添加和删除管理员，添加和删除供应商，添加和删除用户，修改用户信息，修改供应商信息，修改管理员信息
功能：登录、修改密码、找回密码、修改超级管理员个人信息

### 普通管理员
权限：添加和删除供应商，添加和删除用户，修改用户信息，修改供应商信息
功能：登录、修改密码、找回密码、修改管理员个人信息

### 用户/经销商
权限：修改用户/供应商信息、注销账号
功能：注册、登录、修改密码、找回密码、修改用户/经销商信息、注销用户/供应商账号

### 产品信息
权限：添加、删除、修改、查询





## 项目设计

### 数据库设计
**一个数据库**
- TsingTao_Beer_User_Management_System

**下置三张表**
- 置单独管理员表(Admins)，用于管理用户、供应商等；
- 置供应商与用户一体的表(Users)，记录用户信息；
- 置产品信息表(Products)，记录产品信息；

### 项目架构
使用vue3框架+node.js+mysql，html、css、js、vue、vuex、vue-router、axios、element-plus等相关组件进行实现；

实现通过前端操作来完成对后台数据库的增、删、改、查；






## 设计细节

### 表设计

#### 管理员数据表设计
**字段设计：**
- 管理员id（admin_id）：uuid，主键
- 管理员name（admin_name）
- 管理员密码（password）
- 管理员邮箱（email）
- 管理员手机号（telphone）
- 是否为超级管理员（is_super_admin）
- 创建时间（create_at）
- 更新时间（update_at）

```MySQL
CREATE TABLE Admins (
    admin_id VARCHAR(255) PRIMARY KEY, -- 使用uuid
    admin_name VARCHAR(50) NOT NULL,
    password VARCHAR(255) NOT NULL, -- 经过md5加密后的密码
    email VARCHAR(100) NOT NULL,
    telphone VARCHAR(100) NOT NULL,
    is_super_admin BOOLEAN NOT NULL DEFAULT FALSE, -- 是否为超级管理员
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

INSERT INTO Admins (admin_id, admin_name, password, email, is_super_admin)
VALUES
('1', 'admin1', 'password1', 'admin1@example.com', TRUE),
('2', 'admin2', 'password2', 'admin2@example.com', FALSE),
('3', 'admin3', 'password3', 'admin3@example.com', FALSE),
('4', 'admin4', 'password4', 'admin4@example.com', FALSE),
('5', 'admin5', 'password5', 'admin5@example.com', FALSE);
```

#### 用户&供应商数据表设计
**字段设计：**
- 用户id（user_id）：uuid，主键
- 用户名（user_name）
- 密码（password）：md5加密后的密码
- 邮箱（email）
- 手机号（telphone）
- 用户类型（user_type）：枚举类型，枚举值：Customer（普通用户）、Dealer（供应商）
- 金额（money）：用户余额
- 创建时间（create_at）
- 更新时间（update_at）

```MySQL
CREATE TABLE Users (
    user_id VARCHAR(255) PRIMARY KEY, -- 使用uuid
    user_name VARCHAR(50) NOT NULL,
    password VARCHAR(255) NOT NULL, -- md5加密后的密码
    email VARCHAR(100) NOT NULL,
    telphone VARCHAR(100) NOT NULL,
    user_type ENUM('Customer', 'Dealer') NOT NULL, -- 用户类型（供应商还是普通用户）
    money DECIMAL(10, 2) NOT NULL DEFAULT 0.00, -- 用户余额
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

INSERT INTO Users (user_id, username, password, email, user_type, money)
VALUES
('user1', 'customer1', 'password1', 'customer1@example.com', 'Customer', 10.00),
('user2', 'Dealer1', 'password2', 'Dealer1@example.com', 'Dealer', 10.00),
('user3', 'customer2', 'password3', 'customer2@example.com', 'Customer', 10.00),
('user4', 'Dealer2', 'password4', 'Dealer2@example.com', 'Dealer', 10.00),
('user5', 'customer3', 'password5', 'customer3@example.com', 'Customer', 10.00),
('user6', 'Dealer3', 'password6', 'Dealer3@example.com', 'Dealer', 10.00);
```

#### 产品信息表
**字段设计：**
- 产品id（product_id）：自增主键
- 产品名称（product_name）
- 产品价格（price）
- 生产厂家（manufacturer）
- 产品原料（raw_material）
- 产品描述（product_desc）
- 创建时间（create_at）
- 更新时间（update_at）


```MySQL
CREATE TABLE Products (
    product_id INT AUTO_INCREMENT PRIMARY KEY,
    product_name VARCHAR(100) NOT NULL,
    product_price DECIMAL(10, 2) NOT NULL,
    manufacturer VARCHAR(100) NOT NULL,
    raw_materials VARCHAR(255) NOT NULL,
    product_description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

INSERT INTO Products (product_name, product_price, manufacturer, raw_materials, product_description)
VALUES
('Product1', 29.99, 'Manufacturer1', 'Material1, Material2', 'This is the description of Product1.'),
('Product2', 49.99, 'Manufacturer2', 'Material3, Material4', 'This is the description of Product2.'),
('Product3', 99.99, 'Manufacturer3', 'Material5, Material6', 'This is the description of Product3.'),
('Product4', 79.99, 'Manufacturer4', 'Material7, Material8', 'This is the description of Product4.'),
('Product5', 39.99, 'Manufacturer5', 'Material9, Material10', 'This is the description of Product5.');
```

### 项目结构
#### 先置登陆页面
- 需要用户输入用户名和密码，如果用户名和密码正确，则跳转到首页，否则提示错误信息。
- 需要验证用户名和密码是否符合规则，例如用户名只能使用字母、数字、下划线；密码长度不能小于6位且小于16位，并同时包含大小写字母。
- 设置登录按钮，只有当用户名和密码都输入正确时，才能点击登录按钮。
- 设置找回密码按钮，点击后跳转到找回密码页面。
- 设置注册按钮，点击后跳转到注册页面。

#### 注册页面
- 需要用户输入用户名、密码、确认密码、邮箱、手机号，如果用户名、密码、确认密码、邮箱、手机号都符合规则，则提示注册成功，否则提示错误信息。
- 设置注册按钮，只有当用户名、密码、确认密码、邮箱、手机号都符合规则时，才能点击注册按钮。

#### 找回密码页面
- 需要用户输入邮箱或者手机号，如果手机号或者邮箱存在于数据库，用户已经输入新密码，且重复输入进行了密码验证一致，
则随机生成一个验证码让用户输入，如果验证码也输入正确，则提示修改密码成功，否则提示错误信息。
- 密码修改成功后，将新密码进行md5加密存储到数据库，并跳转到登陆页面。

#### 登陆成功后，跳转到首页
- 首页左上角设置提示信息：“欢迎用户{用户名}登录”；
- 右上角设置提示信息：“退出登录”，并且点击退出按钮后，跳转到登录页面；
- 首页需要显示用户名、余额、购物车商品数量、商品列表。
- 设置导航栏，点击导航栏中的推荐、新品、热销、特价，跳转到对应的商品列表页面。
- 左侧导航栏设置用户中心、购物车、我的订单、我的收藏、我的地址、我的评论。

#### 管理员登录
- 管理员登录页面，需要输入管理员账号和密码，如果输入正确，则跳转到管理员页面，否则提示错误信息。
- 管理员登陆后首页展示所有商品列表，并可以对商品进行增删改查操作。
- 支持对商品信息的模糊查找，例如输入“手机”可以找到“手机壳”、“手机膜”、“手机配件”。
- 支持对商品进行排序，例如按价格升序、价格降序、销量升序、销量降序、发布时间升序、发布时间降序。
- 支持对商品进行分页，例如每页显示10条商品信息，支持跳转到第2页、第3页、第4页。