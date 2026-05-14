describe('Promise Test', () => {
    it('should throw an error inside promise', async () => {
        await expect(Promise.resolve().then(() => {
            throw new TypeError('wsModule.Server is not a constructor');
        })).rejects.toThrow(TypeError);
    });
});