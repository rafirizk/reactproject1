import React, {useState} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

const useStyles = makeStyles({
    root: {
      width: '100%',
    },
    container: {
      maxHeight: 440,
    },
});

const ipsum = 'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quia, veniam inventore quae officia dolor a? Voluptas eos tempora debitis, fugit quis in culpa placeat, tenetur sunt, nihil deserunt cupiditate officiis.'

export default function StickyHeadTable() {
    const classes = useStyles();

    const readMore = (words => {
        const countWords = words.split(' ').filter((val)=> val !==' ').length
        const arrayWords = words.split(' ').map((val, index) => index < 11 ? val:'')
        if (countWords >10){
            const finalWords = arrayWords.join(' ')
            return (
                <>
                {finalWords}
                <span style={{color: 'grey'}}>Read More..</span>
                </>
            )
        }
        return words
    })

    return (
        <Paper className={classes.root}>
        <TableContainer className={classes.container}>
            <Table stickyHeader aria-label="sticky table">
                <TableHead>
                    <TableRow>
                        <TableCell>No.</TableCell>
                        <TableCell>Nama Trip</TableCell>
                        <TableCell>Gambar</TableCell>
                        <TableCell>Tanggal Mulai</TableCell>
                        <TableCell>Tanggal Berakhir</TableCell>
                        <TableCell>Harga</TableCell>
                        <TableCell>Keterangan</TableCell>
                    </TableRow>
                </TableHead>
                    <TableBody>
                        <TableCell>1</TableCell>
                        <TableCell>Go to Bali</TableCell>
                        <TableCell>
                            <div style={{maxWidth:'100px'}}>
                                <img width='100%' height='100%' src={require('../assets/Go_to_Bali.jpg')} />
                            </div>
                        </TableCell>
                        <TableCell>{'2020-09-10'}</TableCell>
                        <TableCell>{'2020-10-08'}</TableCell>
                        <TableCell>Rp 20000</TableCell>
                        <TableCell>
                            <div style={{maxWidth:'400px'}}>
                                {readMore(ipsum)}
                            </div>
                        </TableCell>
                    </TableBody>
            </Table>
        </TableContainer>
        </Paper>
    );
}