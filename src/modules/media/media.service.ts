import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { unlink } from 'fs/promises';
import { join } from 'path';
import { FileNotFound } from 'src/common/exceptions/file-system';

/**
 * Media service that handles operations on files in the storage.
 */
@Injectable()
export class MediaService {
  /**
   * Removes a file from the storage.
   *
   * @param path - Path to the file to be removed.
   * @return If the file was successfully removed, a Promise<void> will be returned, otherwise an error will be thrown.
   */
  async removeFile(path: string): Promise<void> {
    const filePath = join(process.cwd(), 'storage', path);

    try {
      await unlink(filePath);
    } catch (err) {
      if (err.code === 'ENOENT') {
        throw new FileNotFound();
      } else {
        throw new InternalServerErrorException('Something went wrong');
      }
    }
  }
}
