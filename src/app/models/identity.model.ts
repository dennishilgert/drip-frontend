export interface IIdentity {
  uuid: string
  name: string
}

export interface IUpdateIdentityLocationData {
  geolocation: {
    longitude: number
    latitude: number
  }
}