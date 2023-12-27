import { Injectable, PipeTransform } from "@nestjs/common";
import * as bcrypt from 'bcrypt'

@Injectable()
export class PasswordHash implements PipeTransform {
  async transform(password: string) {
    const salt = await bcrypt.genSalt(15)
    return await bcrypt.hash(password, salt)
  }
}