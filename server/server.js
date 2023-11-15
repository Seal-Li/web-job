const app = require('./app');
const userLoginRoutes = require('./routes/userLoginRoutes');
const userRegistrationRoutes = require('./routes/userRegisterRoutes');
const passwordResetRoutes = require('./routes/passwordResetRoutes');
const accountExistenceRoutes = require('./routes/accountExistenceRoutes');
const allProductRoutes = require('./routes/allProductRoutes');
const productSearchRoutes = require('./routes/productSearchRoutes');
const userUpdateRoutes = require('./routes/userUpdateRoutes');
const productUpdateRoutes = require('./routes/productUpdateRoutes');
const productDeleteRoutes = require('./routes/productDeleteRoutes');
const productAddRoutes = require('./routes/productAddRoutes');


// 使用路由
app.use(userLoginRoutes);
app.use( userRegistrationRoutes);
app.use( passwordResetRoutes);
app.use(accountExistenceRoutes);
app.use(allProductRoutes);
app.use(productSearchRoutes);
app.use(userUpdateRoutes);
app.use(productUpdateRoutes);
app.use(productDeleteRoutes);
app.use(productAddRoutes);


const PORT = process.env.PORT || 3000;

// 启动服务器
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
