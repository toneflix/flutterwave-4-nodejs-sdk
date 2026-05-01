export interface V3BvnVerificationQueryParams {
    include_complete_message?: string | number | boolean
}

export interface V3BvnVerificationData {
    first_name: string
    last_name: string
    status: string
    reference: string
    callback_url: string
    bvn_data: {
        bvn: string
        nin: string
        email: string
        gender: string
        surname: string
        serialNo: string
        faceImage: string
        firstName: string
        landmarks: string
        branchName: string
        middleName: string
        nameOnCard: string
        dateOfBirth: string
        lgaOfOrigin: string
        watchlisted: string
        lgaOfCapture: string
        phoneNumber1: string
        phoneNumber2: string
        maritalStatus: string
        stateOfOrigin: string
        enrollBankCode: string
        enrollUserName: string
        enrollmentDate: string
        lgaOfResidence: string
        stateOfCapture: string
        additionalInfo1: string
        productReference: string
        stateOfResidence: string
        created_at: string
        complete_message: string
    }
}
