
<template>
    <div>
        <FullCalendar ref="fullCalendar" :events="events" :options="options_" @eventClick="test" />
    </div>
</template>

<script setup>
import { ref, onMounted, onBeforeMount } from 'vue';
import '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import Multimonth from '@fullcalendar/multimonth';
import resourceTimelinePlugin from '@fullcalendar/resource-timeline';
import moment from 'moment';
import { useStore } from "../../../../store";
import Service from '../../../../service/api';
const service = new Service();
const evnet_task = ref();
const store = useStore();
onBeforeMount(() => {
    get();
})
onMounted(() => {
})
const get = async () => {
    const task_ = await service.post('/read/get_task', {});
    if (task_.message == 'success') {
        console.log(task_.data);
        evnet_task.value = task_.data.map(e => {
            return {
                id: e.task_id,
                title: e.task_title,
                start: moment(e.start_date).format("YYYY-MM-DD"),
                end: moment(e.end_date).format("YYYY-MM-DD"),
                eventColor: 'red'
            }
        })
        console.log(evnet_task.value);
        // events: [
        //     { "id": 1, "title": "All Day Event", "start": "2017-02-01", resourceId: 'a', commad: () => test('ds') },
        //     { "id": 2, "title": "Long Event", "start": "2017-02-07", "end": "2017-02-10", resourceId: 'd1' },
        //     { "id": 3, "title": "Repeating Event", "start": "2017-02-09T16:00:00", resourceId: 'g' },
        //     { "id": 4, "title": "Repeating Event", "start": "2017-02-16T16:00:00" },
        //     { "id": 5, "title": "Conference", "start": "2017-02-11", "end": "2017-02-13" },
        //     { "id": 6, "title": "Meeting", "start": "2017-02-12T10:30:00", "end": "2017-02-12T12:30:00" },
        //     { "id": 7, "title": "Lunch", "start": "2017-02-12T12:00:00" },
        //     { "id": 8, "title": "Meeting", "start": "2017-02-12T14:30:00" },
        //     { "id": 9, "title": "Happy Hour", "start": "2017-02-12T17:30:00" },
        //     { "id": 10, "title": "Dinner", "start": "2017-02-12T20:00:00" },
        //     { "id": 11, "title": "Birthday Party", "start": "2017-02-13T07:00:00" },
        //     { "id": 12, "title": "Click for Google", "start": "2017-02-28" }
        // ],
    }
}

const fullCalendar = ref();
const myFunction = () => {
    console.log('My function called!');
}
const test = (e) => {
    console.log(e);
}
const options_ = ref({
    plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin, Multimonth, resourceTimelinePlugin],
    initialDate: moment().format("YYYY-MM-DD"),
    headerToolbar: {
        left: 'prev,next today',
        center: 'title',
        right: store.role == 1 ? 'resourceTimeline,resourceTimelineDay,resourceTimelineWeek,resourceTimelineMonth' : 'dayGridMonth,dayGridWeek,dayGridDay,multiMonthYear'
    },
    locale: 'th',
    timeZone: 'Bangkok',
    resourceAreaHeaderContent: 'พนักงาน',
    resources: async () => {
        const task_ = await service.post('/read/get_task', {});
        if (task_.message == 'success') {
            console.log(task_.data);
            const event = task_.data.map(e => {
                return {
                    id: e.task_id,
                    title: e.task_title,
                    eventColor: e.status == 1 ? 'blue' : e.status == 2 ? 'orange' : e.status == 3 ? 'grey' : e.status == 8 ? 'help' : 'red',
                }
            })
            return event
        }
    },
    events: async () => {
        const task_ = await service.post('/read/get_task', {});
        if (task_.message == 'success') {
            console.log(task_.data);
            const event = task_.data.map(e => {
                return {
                    id: e.task_id,
                    title: e.task_title,
                    start: moment(e.start_date).format("YYYY-MM-DD"),
                    end: moment(e.end_date).format("YYYY-MM-DD"),
                    resourceId: e.task_id
                }
            })
            return event
        }
    },
    editable: true,
    selectable: true,
    selectMirror: true,
    dayMaxEvents: true,
    eventClick: (e) => {
        console.log(e);
    },
    select: this.handleDateSelect,
    
});

debugger

// [
//         { "id": 1, "title": "Auditorium A", "eventColor": "green" },
//         { "id": "b", "title": "Auditorium B", "eventColor": "green" },
//         { "id": "c", "title": "Auditorium C", "eventColor": "orange" },
//         {
//             "id": "d", "title": "Auditorium D",
//             "children": [{ "id": "d1", "title": "Room D1" }, { "id": "d2", "title": "Room D2" }]
//         },
//         { "id": "e", "title": "Auditorium E" },
//         { "id": "f", "title": "Auditorium F", "eventColor": "red" },
//         { "id": "g", "title": "Auditorium G" },
//         { "id": "h", "title": "Auditorium H" },
//         { "id": "i", "title": "Auditorium I" },
//         { "id": "j", "title": "Auditorium J" },
//         { "id": "k", "title": "Auditorium K" },

//     ],
const option = ref({
    plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin, Multimonth],

    headerToolbar: {
        left: 'prev,next today',
        center: 'title',
        right: 'dayGridMonth,dayGridWeek,dayGridDay,multiMonthYear'
    },
    locale: 'th',
    events: [
        { "id": 1, "title": "All Day Event", "start": "2017-02-01", resourceId: 'a', commad: () => test('ds'), "eventColor": "red" },
        { "id": 2, "title": "Long Event", "start": "2017-02-07", "end": "2017-02-10", resourceId: 'd1', eventColor: 'red' },
        { "id": 3, "title": "Repeating Event", "start": "2017-02-09T16:00:00", resourceId: 'g' },
        { "id": 4, "title": "Repeating Event", "start": "2017-02-16T16:00:00" },
        { "id": 5, "title": "Conference", "start": "2017-02-11", "end": "2017-02-13" },
        { "id": 6, "title": "Meeting", "start": "2017-02-12T10:30:00", "end": "2017-02-12T12:30:00" },
        { "id": 7, "title": "Lunch", "start": "2017-02-12T12:00:00" },
        { "id": 8, "title": "Meeting", "start": "2017-02-12T14:30:00" },
        { "id": 9, "title": "Happy Hour", "start": "2017-02-12T17:30:00" },
        { "id": 10, "title": "Dinner", "start": "2017-02-12T20:00:00" },
        { "id": 11, "title": "Birthday Party", "start": "2017-02-13T07:00:00" },
        { "id": 12, "title": "Click for Google", "start": "2017-02-28" }
    ],
    timeZone: 'Bangkok',
    resourceAreaHeaderContent: 'Rooms',
    initialDate: moment().format("YYYY-MM-DD"),
    selectable: true,
    selectMirror: true,
    dayMaxEvents: true
})

</script>

<style scoped>
@media screen and (max-width: 960px) {
    ::v-deep(.fc-header-toolbar) {
        display: flex;
        flex-wrap: wrap;
    }
}
</style>