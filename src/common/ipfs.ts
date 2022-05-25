const Web3StorageToken =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDNjRjEzMTJDNjM4ZDAwMWYyMmMwZkM5NzgxMzYwNjM1QkIxNGVBMjkiLCJpc3MiOiJ3ZWIzLXN0b3JhZ2UiLCJpYXQiOjE2NTM0NTU5NDM2MjksIm5hbWUiOiJDcm9zc1N5bmMifQ.h1jr-jHrRUxZhARzJQzuVBzEHVgu3atCS8VJAqtO4Hk';

export const upload = async (file: File | Blob) => {
    const formData = new FormData();
    formData.append('file', file);

    const result = await fetch('https://api.web3.storage/upload', {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${Web3StorageToken}`,
        },
        body: formData,
    });

    if (result.ok) {
        const json = await result.json();
        return `ipfs://${json.cid}`;
    }
};
