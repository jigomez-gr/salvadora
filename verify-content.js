const http = require('http');

http.get('http://localhost:3000', (res) => {
    let data = '';
    res.on('data', (chunk) => { data += chunk; });
    res.on('end', () => {
        console.log('Status code:', res.statusCode);
        const checks = [
            { name: "CENTRO DE YOGA FUENLABRADA", found: data.includes("CENTRO DE YOGA FUENLABRADA") },
            { name: "Salvadora Conesa", found: data.toLowerCase().includes("salvadora conesa") },
            { name: "logo.png", found: data.includes("logo.png") }
        ];
        console.log('Checks results:');
        checks.forEach(c => console.log(`- ${c.name}: ${c.found ? 'PASSED' : 'FAILED'}`));

        if (checks.every(c => c.found)) {
            console.log('ALL VERIFICATIONS PASSED CONGRATS!');
        } else {
            console.error('SOME VERIFICATIONS FAILED.');
            process.exit(1);
        }
    });
}).on('error', (err) => {
    console.error('Error:', err);
    process.exit(1);
});
