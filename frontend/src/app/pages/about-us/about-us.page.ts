import { Component } from '@angular/core';
import { UtilsService } from '../../services/utils/utils.service';

@Component({
    selector: 'app-about-us',
    templateUrl: './about-us.page.html',
    styleUrls: ['./about-us.page.scss'],
})
export class AboutUsPage {
    public readonly sarahInfo = `
        Sarah was born in Albany, New York and grew up in Union, Kentucky.
        Sarah is the second oldest of ten, with eight brothers and one sister.
        After high school, Sarah enlisted in the Army National Guard while studying
        Electrical Engineering at the University of Kentucky. She currently works as
        an Embedded Software Developer at GE Aviation in Cincinnati. Sarah enjoys
        spending time with her friends and family, and cooking.
    `;

    public readonly daneInfo = `
        Dane was born and raised in Loveland, Ohio, just north of Cincinnati, and is
        an only child. He graduated from the University of Cincinnati with a degree
        in Computer Science and currently works in downtown Cincinnati as an Analytics
        Engineer for GE Digital. In his free time, Dane enjoys developing software and
        hanging-out with his best friend (Sarah), and cannot wait to start their lives together.
    `;

    public readonly timeline = [
        {
            expanded: false,
            headerTitle: 'Friends at work',
            headerDate: '8/27/2015',
            content: `
                Sarah and Dane met during their sophomore year of college while interning at the
                Air Force Research Lab (AFRL) in Dayton, Ohio. They enjoyed working together and
                quickly became friends. Both still reminisce about their time at the AFRL, their
                first impressions of each other, and how lucky they are to have met.
            `
        },
        {
            expanded: false,
            headerTitle: 'Chili\'s night',
            headerDate: '10/17/2015',
            content: `
                Over the weekends of their internship in the fall of 2015, Dane and Sarah would
                routinely travel to their respective parents' homes in Loveland, Ohio and Union,
                Kentucky. On a Saturday night in mid-October, Sarah messaged Dane while traveling
                from Dayton to Union and asked if he would like to meet her at a Chili's restaurant
                in Loveland. Sarah and Dane shared their feelings for each other that evening, which
                has officially become known as "Chili's night".
            `
        },
        {
            headerTitle: 'Long distance',
            headerDate: '12/13/2015',
            content: `
                After their internship at the AFRL, Dane and Sarah returned to their respective
                universities. For over two years, they were apart five days a week. Sarah and Dane
                surmounted the distance between them by messaging each other throughout the school
                days and video chatting every night.  On the weekends, they would spend as much time
                together as possible and alternated between visiting Dane's parents in Loveland and
                Sarah's family in Union.
            `,
            expanded: false
        },
        {
            expanded: false,
            headerTitle: 'Adulting',
            headerDate: '5/25/2018',
            content: `
                Sarah and Dane graduated a week apart in the spring of 2018. Dane began working at GE
                the day after Sarah's graduation while Sarah moved to Ohio that summer and began
                working at GE soon after. Over the last two years, they have enjoyed their simple
                work/life balance, grown closer together, and have ultimately become inseparable.
            `
        },
        {
            expanded: false,
            headerTitle: 'Engagement',
            headerDate: '10/3/2019',
            content: `
                In the fall of 2019, Dane and Sarah planned for a trip to Germany from October 3rd to
                the 13th. On the morning of October 3rd, before heading to the airport, they went on
                their regular walk to start the day. During their hike, Dane proposed to Sarah at their
                favorite spot along the trail. Since then, they have been busily planning an amazing wedding
                and are readily looking forward to building a life together, and the many adventures that
                have yet to come.
            `
        }
    ];

    constructor(
        public utilsService: UtilsService
    ) { }

    public ionViewDidEnter() {
        this.utilsService.setTitle('About Us');
    }

    public onExpandEntry(expanded: boolean, index: number) {
        setTimeout(() => {
            this.timeline[index].expanded = expanded;
        }, (expanded ? 0 : 400));
    }
}
