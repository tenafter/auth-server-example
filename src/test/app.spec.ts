import { runApp } from '../app';

describe('App Test', () => {
    it('Run App Success', async () => {
        const app = await runApp();
        expect(app).toBeDefined();
    });
});
