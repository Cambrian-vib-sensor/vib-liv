import React from 'react';
import { Page, Text, View, Document, StyleSheet,Font,Image,Link} from '@react-pdf/renderer';
import { TableCell,TableRow,TableHead,Table,TableBody } from '@mui/material';
import Sensordatatable from './sensordatatable';

const ReportView = ({ reportdata, client_id,dateArray,headerItem,newfromdate,newtodate }) =>{

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

    date:{
    alignContent:'center',
    fontSize:8,
    padding:10,
    borderWidth: 1,  
    width: '100%', 
    textAlign: 'center',   
    },
    subtitlereporttype:{
      fontSize: 30,
      textAlign: 'center',
      fontFamily: 'Oswald',
      marginTop: 80,
      paddingBottom:15
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
      margin: 10,
      fontSize: 16,
      textAlign: 'justify',
      padding:'1px',
      fontFamily: 'Times-Roman'
    },
    content: {
      fontSize: 12,
      textAlign: 'justify',
      padding: 5,
      lineHeight:2,
      fontFamily: 'Times-Roman'
    },
    image: {
      width:'60px',
      height:'60px',
    },
    flowchartimage: {
      marginVertical: 15,
      marginHorizontal: 100,
      width:'350px',
      height:'290px',
    },
    header: {
      fontSize: 24,
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

    grid: {
      display: 'flex',
      flexDirection: 'row',
      flexWrap: 'wrap'
    },
    column: {
      width: '20%',
      padding: 2
    },
    text: {
      fontSize: 6,
    },

    tableRow: { 
      width: '100%',
      flexDirection: "row",
      textAlign: 'center', 
    }, 
    tableCol: { 
      width: '100%',
      borderWidth: 1, 
      padding :'5px',
   }, 

    table:{
      width: '100%',   
      fontSize:'8px',
      marginBottom:'5px',
      wordWrap: 'break-word',
      whiteSpace: 'pre-wrap',
      alignContent:'center',    
    }
  }); 

    return (
     <div>
      <Document>
      <Page style={styles.body}>
      <Text style={styles.header} fixed>
        {/* Cambrian Engineering Corporation Pte Ltd. */}
      </Text>
      <View style={styles.grid} fixed>
      <View style={styles.column}>
       <Text style={styles.text}>DHQ: 33 Ubi Ave 3</Text>
      <Text style={styles.text}>#05-37 Vertex (Tower A)</Text>
      <Text style={styles.text}>Singapore 408868</Text>
      <Text style={styles.text}>T: +65 6269 2005</Text>
      <Text style={styles.text}>F: +65 6269 1955</Text>
      <Text style={styles.text}><Link>E: admin@cambrian.com.sg</Link></Text>
       </View>
      <View style={styles.column}>
       <Text style={styles.text}>Lab: 130 Tuas South Ave 2</Text>
      <Text style={styles.text}>West Point Bizhub</Text>
      <Text style={styles.text}>Singapore 637170</Text>
      <Text style={styles.text}>T: +65 6269 2005</Text>
      <Text style={styles.text}><Link>E: admin@cambrian.com.sg</Link></Text>
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
    <View style={styles.Table} fixed> </View> 
           
      <Text style={styles.subtitlereporttype}>Vibration Monitoring Report</Text>
      <Text  style={styles.subtitlereporttype}>at</Text>
      <Text  style={styles.subtitlereporttype}></Text>
      <Text style={styles.subtitleclinent} > Client: Shimizu Corporation</Text>
      <Text style={styles.subtitle}> 1.0 Introduction</Text>
      <Text style={styles.content}>
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

      <Text style={styles.content}>
     
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

      {/* <Image
        style={styles.flowchartimage}
        src="../../flowchart.png"
      />
        <Text style={styles.subtitle}>
        Figure 1 - Flowchart of Vibration Monitoring System 
        </Text>
        <Text style={styles.subtitle}>Description of flowchart: {"\n"} </Text>
        <Text style={styles.content}>
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
      <Text style={styles.content}>
        The initial preset threshold will be set to the provided vibration limits as
        shown in Table 1
        The vibration monitoring system will be used to monitor the level of vibrations in order
        to minimize inconvenience caused to hospital residents, and to give warning to building
        structures and to comply with requirements.
      </Text>
      <Text style={styles.subtitle}>  3.0 Site Activities </Text>
      <Text style={styles.content}>     
       Minor construction activities are being carried out nearby and within the hospital vicinity.
       There were no construction activities on Sunday, 2 2 n d Jan 2023.{"\n"}  
       All activities are reported by Shimizu Corporation.

      </Text> 
  
      <Image
        style={styles.image}
        src="/images/quijote2.png"
      />*/}
        <Text style={styles.subtitle} >Results</Text>
        <Text style={styles.subtitle}> </Text>
   
     
      { client_id == 10 ? (
            <View style={styles.table}> 
            <View style={styles.tableRow}> 
              <View style={styles.tableCol}> 
                <Text>NO </Text> 
              </View> 
              <View style={styles.tableCol}> 
                <Text>VM Name</Text> 
              </View> 
              <View style={styles.tableCol}> 
                <Text>Sensor ID</Text> 
              </View> 
              <View style={styles.tableCol}> 
                <Text>Locations</Text> 
              </View> 
              <View style={styles.tableCol}> 
                <Text>Vibration limits criteria (10 Hz)</Text> 
              </View> 
              <View style={styles.tableCol}> 
                <Text>Vibration limits criteria (80 Hz)</Text> 
              </View> 
              <View style={styles.tableCol}> 
                <Text>Proposed alarm level</Text> 
              </View> 
            </View>
            { Object.values(reportdata).map((arr, index) => (
            <View style={styles.tableRow}> 
    
              <View style={styles.tableCol}> 
                <Text>{index + 1}</Text> 
              </View> 
              <View style={styles.tableCol}> 
                <Text>{Array.from(new Set(arr.map((item) => item[headerItem])))}</Text> 
              </View> 
              <View style={styles.tableCol}> 
                <Text>{Array.from(new Set(arr.map((item) => item.sensor_id)))} </Text> 
              </View> 
              <View style={styles.tableCol}>
                <Text>{Array.from(new Set(arr.map((item) => item.vibration_max_limit)))} mm/s</Text> 
              </View>
              <View style={styles.tableCol}> 
                <Text>{Array.from(new Set(arr.map((item) => item.vibration_max_limit)))} mm/s</Text> 
              </View> 
               <View style={styles.tableCol}> 
                <Text>{Array.from(new Set(arr.map((item) => item.vibration_max_limit)))} mm/s</Text> 
              </View> 
              <View style={styles.tableCol}> 
                <Text>{Array.from(new Set(arr.map((item) => item.vibration_max_limit)))} mm/s</Text> 
              </View> 
            </View> 
            ))}
    
          </View>) : (<></>)}
          {Object.values(reportdata).map((arr) =>
            <View style={styles.table}>
              <View>
                <View style={styles.tableRow}>
                  <Text style={styles.tableCol}>Period</Text>
                  <Text style={styles.tableCol}>{newfromdate} - {newtodate}</Text>
                </View>
                <View style={styles.tableRow}>
                  <Text style={styles.tableCol}>Location </Text>
                  <Text style={styles.tableCol}> {Array.from(new Set(arr.map((item) => item[headerItem])))}</Text>
                </View>
                <View style={styles.tableRow}>
                  <Text style={styles.tableCol}> Limits from table 1   </Text>
                  <Text style={styles.tableCol}>{Array.from(new Set(arr.map((item) => item.vibration_max_limit)))} mm/s</Text>
                </View>
                <View style={styles.tableRow}>
                  <Text style={styles.tableCol}>Activities within the area of the vibration meter</Text>
                  <Text style={styles.tableCol}>- Footsteps of people walking near the common area
                    - Operation of hospital equipment and machines.
                    - Printer on the opposite side operates periodically
                    - Trays and carts are being pushed near the common area</Text>
                </View>
        </View>

      <Text br/>
             
      <View style={styles.table}>
        <View style={styles.tableRow}>
          <View style={styles.tableCol}>
            <Text >Date </Text>
          </View>
          <View style={styles.tableCol}>
            <Text>Remarks</Text>
          </View>
     </View>
  
  <View style={styles.table}>
    {dateArray.map((date) => {
      const filteredArr = arr.filter(
        (item) =>
          new Date(item.received_at)
            .toISOString()
            .substring(0, 10) ===
          date.toISOString().substring(0, 10)
      );
      const exceedsLimit = filteredArr.some(
        (item) => item.sensor_value > item.vibration_max_limit
      );
      return (
        <View
          style={styles.tableRow}
          key={date.toISOString().substring(0, 10)}
        >
          <Text style={styles.date}>
            {date.toISOString().substring(0, 10)}
          </Text>
          <View style={styles.tableRow}>
            { exceedsLimit  ? (
              filteredArr.map((item) => (
                <Text key={item.sensor_value}>
                  {item.sensor_value > item.vibration_max_limit && (
                    <Text style={styles.tableCol}>
                      Exceeding {item.vibration_max_limit} with{' '}
                      {item.sensor_value} mm/s between 1 Hz – 80 Hz 
                      {/* at{' '} {item.received_at} */}
                    </Text>
                  )}
                </Text>
              ))
              ) : (         
              <Text style={styles.tableCol}>
                Not exceeding{' '}
                {Array.from(
                  new Set(arr.map((item) => item.vibration_max_limit))
                )}{' '}
                mm/s between 1 Hz – 80 Hz
              </Text>
            )}
          </View>
        </View>
      );
 
      
    })}
    </View>
    </View>
  </View>
    )
  }
    <Text style={styles.subtitle} >5.0 Interpretation of Vibration Data</Text>
    <Text style={styles.subtitle} >6.0 Conclusion</Text>
    <Text style={styles.content}>
       During the periods of monitoring 1 5 t h Jan 2023 – 21st Jan 2023, the vibration
      readings were not exceeded the threshold limit at VM-MAH-(EYE), VM- MAH- (MRI), 
      VM-MAH-(ICU), VM-MAH-(Laser Room), VM-MAH-(CVL) and VM- MAH-(NICU).
      </Text>
      <Text>Thank you.</Text>
      <Text>Yours Faithfully.</Text>
      <Text>Prepared by: Ong Chun Yong</Text>
      <Text>(Instrumentation Engineer)</Text>
      <Text>Reviewed by: Dr. Danny Oh</Text>
      <Text>(Director)</Text>           
      <Text style={styles.pageNumber} render={({ pageNumber, totalPages }) => (
        `${pageNumber} / ${totalPages}`
      )} fixed />
    </Page>
  </Document>
  
  </div>
   
 )}

export default ReportView;