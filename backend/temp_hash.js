const bcrypt = require('bcrypt');
const password = '123456';
bcrypt.hash(password, 10, (err, hash) => {
    console.log(hash);
});
