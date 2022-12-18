export interface IIdentity {
  uuid: string
  name: string
}

export interface ILookupIdentity {
  name: string
}

export interface ILookupIdentityData {
  name: string
}

export interface IUpdateIdentityLocationData {
  geolocation: {
    longitude: number
    latitude: number
  }
}