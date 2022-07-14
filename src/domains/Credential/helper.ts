import { CredentialModel, ICredential } from ".";

export function modelCredentialData(credential: ICredential): CredentialModel {
  return new CredentialModel(
    credential.phone,
    credential.password,
    credential.fullName,
    credential.avatar
  );
}

export function normalizeCredentialData(
  credentialModel: CredentialModel
): ICredential {
  const phone = credentialModel.getPhone();
  const password = credentialModel.getPassword();
  const fullName = credentialModel.getFullName();
  const avatar = credentialModel.getAvatar();

  return {
    phone,
    password,
    fullName,
    avatar,
  };
}
