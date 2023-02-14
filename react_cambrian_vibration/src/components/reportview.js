import React from 'react';
import { Page, Text, View, Document, StyleSheet,Font,Image} from '@react-pdf/renderer';

const ReportView = () =>{

  Font.register({
    family: 'Oswald',
    src: 'https://fonts.gstatic.com/s/oswald/v13/Y_TKV6o8WovbUd3m_X9aAA.ttf'
  });
  
  const styles = StyleSheet.create({
    body: {
      paddingTop: 35,
      paddingBottom: 65,
      paddingHorizontal: 35,
    },
    title: {
      fontSize: 20,
      textAlign: 'left',
      fontFamily: 'Oswald'
    },
    subtitlereporttype:{
      fontSize: 20,
      textAlign: 'center',
      fontFamily: 'Oswald'
    },
    subtitleclinent:{
      fontSize: 18,
      textAlign: 'center',
      fontFamily: 'Oswald'
    },
    author: {
      fontSize: 12,
      textAlign: 'center',
      marginBottom: 40,
    },
    subtitle: {
      fontSize: 18,
      margin: 12,
      textAlign: 'left',
      fontFamily: 'Oswald'
    },
    text: {
      margin: 20,
      fontSize: 20,
      textAlign: 'justify',
      padding:'2px',
      fontFamily: 'Times-Roman'
    },
    image: {
      width:'50px',
      height:'50px',
    },
    flowchartimage: {
      marginVertical: 15,
      marginHorizontal: 100,
      width:'250px',
      height:'250px',
    },
    header: {
      fontSize: 24,
      marginBottom: 2,
      fontFamily: 'Oswald',
      textAlign: 'left',
        
    },
    pageNumber: {
      position: 'absolute',
      fontSize: 12,
      bottom: 30,
      left: 0,
      right: 0,
      textAlign: 'center',
      color: 'grey',
    },

    table: { 
      display: "table", 
      width: "auto", 
      borderStyle: "solid", 
      borderWidth: 1, 
      borderRightWidth: 0, 
      borderBottomWidth: 0 
    }, 
    tableRow: { 
      margin: "auto", 
      flexDirection: "row" 
    }, 
    tableCol: { 
      width: "25%", 
      borderStyle: "solid", 
      borderWidth: 1, 
      borderLeftWidth: 0, 
      borderTopWidth: 0 
    }, 
    tableCell: { 
      margin: "auto", 
      marginTop: 5, 
      fontSize: 10 
    },
    grid: {
      display: 'flex',
      flexDirection: 'row',
      flexWrap: 'wrap'
    },
    column: {
      width: '20%',
      padding: 10
    },
    text: {
      fontSize: 8,
    },
   
  });
  

    return (
      <Document>
      <Page style={styles.body}>
      <Text style={styles.header} fixed>
      Cambrian Engineering Corporation Pte Ltd.
      </Text>

      <View style={styles.grid} fixed>
      <View style={styles.column}>
       <Text style={styles.text}>DHQ: 33 Ubi Ave 3</Text>
      <Text style={styles.text}>#05-37 Vertex (Tower A)</Text>
      <Text style={styles.text}>Singapore 408868</Text>
      <Text style={styles.text}>T: +65 6269 2005</Text>
      <Text style={styles.text}>F: +65 6269 1955</Text>
      <Text style={styles.text}>E: admin@cambrian.com.sg</Text>
       </View>
      <View style={styles.column}>
       <Text style={styles.text}>Lab: 130 Tuas South Ave 2</Text>
      <Text style={styles.text}>West Point Bizhub</Text>
      <Text style={styles.text}>Singapore 637170</Text>
      <Text style={styles.text}>T: +65 6269 2005</Text>
      <Text style={styles.text}>E: admin@cambrian.com.sg</Text>
            </View>
        <View style={styles.column}>
        <Image
        style={styles.image}
        src="../../bizsafe-logo.png"
        />
       </View>
       <View style={styles.column}>
        <Image
        style={styles.image}
        src="../../soco_page-0001.png"
      />
       </View>

       <View style={styles.column}>
        <Image
        style={styles.image}
        src="../../sac_page-0001.png"
      />
      </View>
    </View>       
      <Text style={styles.subtitlereporttype}>
        Vibration Monitoring Report

              at

        Mount Alvernia Hospital
        </Text>
        <Text style={styles.subtitleclinent} > Client: Shimizu Corporation</Text>
        <View style={styles.table}> 
      </View> 

      <Text style={styles.subtitle}> 1.0 Introduction</Text>
      <Text style={styles.text}>
     
        This is the vibration monitoring report carried out for the period between 15th Jan 2023 to
        21st Jan 2023 at Mount Alvernia Hospital.{"\n"}
        Six (6) sensors were installed on 01 Sep 2021.{"\n"}
        The vibration transducers have been placed inside the designated rooms within the
        hospital at VM-MAH-(EYE), VM-MAH-(ICU), VM-MAH-(MRI), VM-MAH-(Laser
        Room), VM-MAH-(CVL) and VM-MAH-(NICU).
        (See location plan – Appendix A).{"\n"}
        The monitoring results are compiled for this report.

      </Text>
      <Text style={styles.subtitle}>  2.0 Vibration Monitoring System</Text>

      <Text style={styles.text}>
     
        Vibration monitoring will be carried out using a very sensitive Micro Electro- Mechanical
        Sensor (MEMS) system that is able to record micro vibration/velocity signals and/or
        RMS vibration levels and capture the 1/3 octave band from 1 Hz to 80 Hz.
        The vibration monitoring system is essentially a sensor with a built-in battery and
        wireless module that operates continuously. The transducer will be installed on the floor
        and connected to a power supply. The recording unit will automatically record the peak
        particle velocity in the vertical, longitudinal, and transverse direction from the vibration
        source and compare the readings to a preset threshold level. The results will be stored in
        the in-built memory. If the threshold is exceeded, email and SMS alert will be sentout to
        pre-designated phone numbers and email addresses. Figure 1 illustrates theflowchart of 
        the system. The alert system depends on a persistent Internet connection to send Emails 
        and good mobile coverage to send SMS notifications.
      </Text>

      <Image
        style={styles.flowchartimage}
        src="../../flowchart.png"
      />
        <Text style={styles.subtitle}>
        Figure 1 - Flowchart of Vibration Monitoring System c
        </Text>
        <Text style={styles.subtitle}>Description of flowchart: {"\n"} </Text>
        <Text style={styles.text}>
        [1] – Vibration meter on remote site continuously monitors and processes data {"\n"}
        [2] – An event is described as a condition where the vibration level is above the preset
        limit. If there is no event, it will sit and continue to monitor. If there is an event, the
        vibration meter connects to a local 4g router to trigger an alert server {"\n"}
        [3] – An alert server immediately detects that there is an event and prepares to send alerts
        to relevant parties {"\n"}
        [4] – The alert server compiles the list of email addresses and phone numbers to send the
        alerts to {"\n"}
        [5] – The alert server composes an email message and sends the data to registered email
        addresses. The messages are sent immediately; receiving times can vary and it depends
        on the recipients’ email exchange server {"\n"}
        [6] – The alert server then constructs sms message and sends the data to registered phone
        numbers. The messages are sent out immediately; receiving times can vary depending on
        the mobile network and the number of phone numbers on queue
      </Text>
      <Text style={styles.text}>
        The initial preset threshold will be set to the provided vibration limits as
        shown in Table 1
        The vibration monitoring system will be used to monitor the level of vibrations in order
        to minimize inconvenience caused to hospital residents, and to give warning to building
        structures and to comply with requirements.
      </Text>
      <Text style={styles.subtitle}>  3.0 Site Activities </Text>

      <Text style={styles.text}>     
      Minor construction activities are being carried out nearby and within the hospital vicinity.
      There were no construction activities on Sunday, 2 2 n d Jan 2023.{"\n"}  
      All activities are reported by Shimizu Corporation.

      </Text>
  
      <Image
        style={styles.image}
        src="/images/quijote2.png"
      />
      <Text style={styles.subtitle} > 4.0 Results</Text>

      <Text style={styles.text}>
       
        For the vibration monitoring at the site, if the vibration is less than the preset threshold
        values set according to Table 1, then no data will be presented.
        The results for VM-MAH-(EYE), VM-MAH-(ICU), VM-MAH-(MRI), VM-MAH-
        (Laser Room), VM-MAH-(CVL) and VM-MAH-(NICU) are reported as follows.
        4.1 Micro Electro-Mechanical Sensor Monitoring System (VM-MAH-(EYE))
        –VC-7 MCD Level 6 Eye Centre
        Table 2–VM-MAH – (EYE)
        4.2 Micro Electro-Mechanical Sensor Monitoring System (VM-MAH-(ICU))
        – VC-4 Block A Level 4 ICU

        4.3 Micro Electro-Mechanical Sensor Monitoring System (VM-MAH-(MRI))
        – VC-2 Block A B1 DID
        Table 4–VM-MAH – (MRI)

        4.4 Micro Electro-Mechanical Sensor Monitoring System (VM-MAH-(Laser Room))
        – VC-5 Block B Level 4 Laser room
        Table 5–VM-MAH – (LASER ROOM)

        4.5 Micro Electro-Mechanical Sensor Monitoring System (VM-MAH-(CVL))
        – VC-6 Block B Level 4 CVL
        Table 6–VM-MAH – (CVL)

        4.6 Micro Electro-Mechanical Sensor Monitoring System (VM-MAH-(NICU))
        – VC-3 Block E Level 4 NICU
        Table 7–VM-MAH – (NICU)

      </Text>
      <Text style={styles.text}>
      6.0 Conclusion
      During the periods of monitoring 1 5 t h Jan 2023 – 21st Jan 2023, the vibration
      readings were not exceeded the threshold limit at VM-MAH-(EYE), VM- MAH- (MRI), 
      VM-MAH-(ICU), VM-MAH-(Laser Room), VM-MAH-(CVL) and VM- MAH-(NICU).
      Thank you.
      Yours Faithfully.
      Prepared by: Ong Chun Yong
      (Instrumentation Engineer)
      Reviewed by: Dr. Danny Oh
      (Director)
      </Text>
     
      <Text style={styles.pageNumber} render={({ pageNumber, totalPages }) => (
        `${pageNumber} / ${totalPages}`
      )} fixed />
    </Page>
  </Document>
 )
}

export default ReportView;