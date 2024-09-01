import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface CategoryCardProps {
  id: string;
  nameAr: string;
  nameNative: string;
  imageUrl: string;
  languageId: string;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ id, nameAr, nameNative, imageUrl, languageId }) => {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-4">
        <div className="grid items-center justify-center gap-4">
          <div className="relative h-28 w-28 overflow-hidden rounded-3xl">
            <Image
              src={imageUrl}
              alt={nameAr}
              layout="fill"
              objectFit="cover"
            />
          </div>
          <div className='grid justify-center'>
            <h3 className="text-lg font-semibold">{nameNative}</h3>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button asChild className="w-full">
          <Link href={`/category/${id}?languageId=${languageId}`}>
            معرفة المزيد
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default CategoryCard;