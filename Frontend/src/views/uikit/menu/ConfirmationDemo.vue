<template>
    <div class="stepsdemo-content">
        <Card>
            <template v-slot:title>
                Payment Information
            </template>
            <template v-slot:subtitle>
                Enter your card details
            </template>
            <template v-slot:content>
                <div class="p-fluid formgrid grid">
                    <div class="field col-12">
                        <Label for="class">Card Holder Name</Label>
                        <InputText type="text" v-model="cardholderName"></InputText>
                    </div>
                    <div class="field col-8">
                        <Label id="number" for="lastname">Number</Label>
                        <InputMask id="number" mask="9999-9999-9999-9999" v-model="cardholderNumber"></InputMask>
                    </div>
                    <div class="field col-2">
                        <Label id="date" for="date">Date</Label>
                        <InputMask id="date" mask="99/99" v-model="date"></InputMask>
                    </div>
                    <div class="field col-2">
                        <Label for="cvv">CVV</Label>
                        <InputMask id="cvv" mask="999" v-model="cvv"></InputMask>
                    </div>
                    <!-- <div class="field-checkbox col-12">
                        <p-checkbox id="remember" v-model="remember" :binary="true"></p-checkbox>
                        <label for="remember" class="p-checkbox-label">Save credit card information for future</label>
                    </div> -->
                </div>
            </template>
            <template v-slot:footer>
                <div class="grid grid-nogutter justify-content-between">
                    <Button label="Back" @click="prevPage()" icon="pi pi-angle-left"></Button>
                    <Button label="Next" @click="nextPage()" icon="pi pi-angle-right" icon-pos="right"></Button>
                </div>
            </template>
        </Card>
    </div>
</template>
<script>
export default {
    data() {
        return {
            firstname: '',
            lastname: '',
            age: null,
            submitted: false,
            validationErrors: {}
        }
    },
    methods: {
        nextPage() {
            this.submitted = true;
            if (this.validateForm()) {
                this.$emit('next-page', { formData: { firstname: this.firstname, lastname: this.lastname, age: this.age }, pageIndex: 0 });
            }
        },
        validateForm() {
            if (!this.firstname.trim())
                this.validationErrors['firstname'] = true;
            else
                delete this.validationErrors['firstname'];

            if (!this.lastname.trim())
                this.validationErrors['lastname'] = true;
            else
                delete this.validationErrors['lastname'];

            return !Object.keys(this.validationErrors).length;
        }
    },
}
</script>

<style>

</style>