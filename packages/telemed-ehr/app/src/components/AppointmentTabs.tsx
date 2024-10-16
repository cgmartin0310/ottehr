import FmdBadOutlinedIcon from '@mui/icons-material/FmdBadOutlined';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import { Box, Grid, Tab, Typography } from '@mui/material';
import { Location } from 'fhir/r4';
import { DateTime } from 'luxon';
import React, { ReactElement, useState } from 'react';
import { UCAppointmentInformation } from 'ehr-utils';
import { otherColors } from '../CustomThemeProvider';
import AppointmentTable from './AppointmentTable';
import Loading from './Loading';

export enum ApptTab {
  'prebooked' = 'prebooked',
  'completed' = 'completed',
  'cancelled' = 'cancelled',
}

interface AppointmentsTabProps {
  location: Location | undefined;
  providers: string[] | undefined;
  groups: string[] | undefined;
  preBookedAppointments: UCAppointmentInformation[];
  completedAppointments: UCAppointmentInformation[];
  cancelledAppointments: UCAppointmentInformation[];
  loading: boolean;
  updateAppointments: () => void;
  setEditingComment: (editingComment: boolean) => void;
}

export default function AppointmentTabs({
  location,
  providers,
  groups,
  preBookedAppointments,
  completedAppointments,
  cancelledAppointments,
  loading,
  updateAppointments,
  setEditingComment,
}: AppointmentsTabProps): ReactElement {
  const [value, setValue] = useState<ApptTab>(ApptTab.prebooked);
  const [now, setNow] = useState<DateTime>(DateTime.now());

  const handleChange = (event: any, newValue: ApptTab): any => {
    setValue(newValue);
  };

  React.useEffect(() => {
    function updateTime(): void {
      setNow(DateTime.now());
    }

    const timeInterval = setInterval(updateTime, 1000);
    // Call updateTime so we don't need to wait for it to be called
    updateTime();

    return () => clearInterval(timeInterval);
  }, []);

  const selectLocationMsg = !location && providers?.length === 0 && groups?.length === 0 && (
    <Grid container sx={{ width: '40%' }} padding={4}>
      <Grid item xs={2}>
        <FmdBadOutlinedIcon
          sx={{
            width: 62,
            height: 62,
            color: otherColors.orange700,
            borderRadius: '50%',
            backgroundColor: otherColors.orange100,
            padding: 1.4,
          }}
        ></FmdBadOutlinedIcon>
      </Grid>
      <Grid
        item
        xs={10}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
        }}
      >
        <Typography sx={{ fontWeight: 'bold' }}>Please select an office, provider, or group</Typography>
        <Typography>Please select an office, provider, or group to get appointments</Typography>
      </Grid>
    </Grid>
  );

  return (
    <>
      <Box sx={{ width: '100%', marginTop: 3 }}>
        <TabContext value={value}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <TabList onChange={handleChange} aria-label="appointment tabs">
              <Tab
                label={`Pre-booked${preBookedAppointments ? ` – ${preBookedAppointments?.length}` : ''}`}
                value={ApptTab.prebooked}
                sx={{ textTransform: 'none', fontWeight: 700 }}
              />
              <Tab
                label={`Completed${completedAppointments ? ` – ${completedAppointments?.length}` : ''}`}
                value={ApptTab.completed}
                sx={{ textTransform: 'none', fontWeight: 700 }}
              />
              <Tab label="Cancelled" value={ApptTab.cancelled} sx={{ textTransform: 'none', fontWeight: 700 }} />
              {loading && <Loading />}
            </TabList>
          </Box>
          <TabPanel value={ApptTab.prebooked} sx={{ padding: 0 }}>
            {selectLocationMsg || (
              <AppointmentTable
                appointments={preBookedAppointments}
                location={location}
                tab={value}
                now={now}
                updateAppointments={updateAppointments}
                setEditingComment={setEditingComment}
              ></AppointmentTable>
            )}
          </TabPanel>
          <TabPanel value={ApptTab.completed} sx={{ padding: 0 }}>
            {selectLocationMsg || (
              <AppointmentTable
                appointments={completedAppointments}
                location={location}
                tab={value}
                now={now}
                updateAppointments={updateAppointments}
                setEditingComment={setEditingComment}
              ></AppointmentTable>
            )}
          </TabPanel>
          <TabPanel value={ApptTab.cancelled} sx={{ padding: 0 }}>
            {selectLocationMsg || (
              <AppointmentTable
                appointments={cancelledAppointments}
                location={location}
                tab={value}
                now={now}
                updateAppointments={updateAppointments}
                setEditingComment={setEditingComment}
              ></AppointmentTable>
            )}
          </TabPanel>
        </TabContext>
      </Box>
    </>
  );
}
