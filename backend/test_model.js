const User = require('./models/User');

async function test() {
    try {
        console.log('Testing User.findByEmail...');
        const user = await User.findByEmail('prubilarmorales@gmail.com');
        console.log('Result:', user);
    } catch (err) {
        console.error('Error:', err.message);
    }
}

test();
