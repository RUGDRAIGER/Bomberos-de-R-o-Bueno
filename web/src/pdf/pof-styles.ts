import { StyleSheet } from '@react-pdf/renderer'

export const pdfStyles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 9,
    fontFamily: 'Helvetica',
  },
  title: {
    fontSize: 14,
    marginBottom: 4,
    fontFamily: 'Helvetica-Bold',
  },
  subtitle: {
    fontSize: 9,
    marginBottom: 12,
    color: '#444',
  },
  section: {
    fontSize: 11,
    marginTop: 8,
    marginBottom: 4,
    fontFamily: 'Helvetica-Bold',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingBottom: 2,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 3,
    alignItems: 'flex-start',
  },
  label: {
    width: '34%',
    fontFamily: 'Helvetica-Bold',
    paddingRight: 6,
  },
  value: {
    width: '66%',
    flexWrap: 'wrap',
    lineHeight: 1.35,
  },
  multiline: {
    marginTop: 2,
    lineHeight: 1.35,
  },
})
