import { Response } from 'express';
import { downloadTransformedFile } from '../src/controller';

test.skip('TEST Implementation WIP', () => {

  describe('downloadTransformedFile', () => {
    let res: Partial<Response>;

    beforeEach(() => {
      res = {
        write: jest.fn(),
        end: jest.fn(),
        status: jest.fn().mockReturnThis(),
        setHeader: jest.fn().mockReturnThis(),
      };
    });

    it('should respond with the transformed file', async () => {
      const req = { params: { fileId: 'buggy' }, query: { scale: [2, 2, 2], translation: [10, 0, 0] } };

      await downloadTransformedFile(req as any, res as Response);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.setHeader).toHaveBeenCalledWith('Content-Type', 'application/octet-stream');
    });
  });

});