export default async function tryCatch(promise) {
    try {
        const data = await promise;
        return [data, null];
    } catch (error) {
        console.error(error);
        return [null, error];
    }
}
