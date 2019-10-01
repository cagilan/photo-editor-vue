import Vue from 'vue';

export const Store = new Vue({
    data() {
        return {
            store: []
        };
    },

    methods: {
        addToStore(photo) {
            const locationInStore = this.store.findIndex(p => {
                return p.details === photo.name;
            })

            if (locationInStore === -1) {
                this.store.push({
                    name: photo.name,
                    size: photo.size,
                    type: photo.type,
                    lastModifiedDate: photo.lastModifiedDate,
                    src: photo.src
                })
            }
        }
    }
});