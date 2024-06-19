import { Messenger, MessengerParams } from "@vk-ecosystem/sdk";

/**
 * Надстройка над мессенджером, где удаляется проверка на peer_id
 * и добавляется новый методы для открытия мессенджера с нужным peer_id
 */
export class MessengerEdu extends Messenger {
  protected override validateParams(
    params: MessengerParams
  ): Promise<MessengerParams> {
    return Promise.resolve(params);
  }

  public openPeerId(peerId: MessengerParams["peer_id"]): void {
    this.update({
      peer_id: peerId,
    });
  }
}
