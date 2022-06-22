import { CredentialModel, ICredential } from ".";

export function modelCredentialData(credential: ICredential): CredentialModel {
  return new CredentialModel(
    credential.phone,
    credential.password,
    credential.fullName
  );
}

export function normalizeCredentialData(
  credentialModel: CredentialModel
): ICredential {
  const phone = credentialModel.getPhone();
  const password = credentialModel.getPassword();
  const fullName = credentialModel.getFullName();

  return {
    phone,
    password,
    fullName,
  };
}
