const rawUrl = 'postgresql://postgres:Makita1234#$.,@db.gyxazovkxkoafugfbnaj.supabase.co:5432/postgres';
const regex = /^(?:postgres|postgresql):\/\/([^:]+):(.+)@([^:/@]+):(\d+)\/(.+)$/;
const match = rawUrl.match(regex);

if (match) {
    console.log('Match success:');
    console.log('User:', match[1]);
    console.log('Password:', match[2]);
    console.log('Host:', match[3]);
    console.log('Port:', match[4]);
    console.log('DB:', match[5]);
} else {
    console.log('Match failed');
}
